import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
import { promisify } from "node:util";
import ts from "typescript";

async function readModule(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

const [{ universityCatalog }, { universityArticles, articleSections }] = await Promise.all([
  readModule("../src/lib/universities.ts"),
  readModule("../src/lib/university-articles.ts"),
]);

const licenses = new Set([
  "CC0", "Public domain", "CC BY 2.0", "CC BY 3.0", "CC BY 4.0",
  "CC BY-SA 2.0", "CC BY-SA 2.5", "CC BY-SA 3.0", "CC BY-SA 4.0",
]);
const forbidden = /[₩$%€£₸]|тенге|(?<!\p{L})вон(?:а|у|ой|е|ы|ам|ами|ах)?(?!\p{L})|рейтинг|место\s+в(?!\p{L})|дедлайн|\d[\d.,\s]*(?:тыс\.?\s+)?студент|студент\p{L}*\s*[:—-]?\s*\d/iu;
const words = /[\p{L}\p{N}]+(?:[-’'][\p{L}\p{N}]+)*/gu;
const segmenter = new Intl.Segmenter("ru", { granularity: "sentence" });
const ids = new Set(universityCatalog.map(({ id }) => id));
const urls = new Map();
const failures = [];
const articles = [];

function articleSentences(paragraphs) {
  return paragraphs.flatMap((paragraph) => [...segmenter.segment(paragraph)].flatMap(({ segment }) => {
    const tokens = segment.normalize("NFC").toLowerCase().replaceAll("ё", "е").match(words);
    if (!tokens) return [];
    const counts = new Map();
    for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);
    return [{ text: segment.trim(), length: tokens.length, counts }];
  }));
}

function findOverlap(first, second) {
  for (const a of first) {
    for (const b of second) {
      const longest = Math.max(a.length, b.length);
      if (10 * Math.min(a.length, b.length) < 7 * longest) continue;
      let shared = 0;
      for (const [word, count] of a.counts) shared += Math.min(count, b.counts.get(word) ?? 0);
      if (10 * shared >= 7 * longest) return { a, b, percent: (100 * shared / longest).toFixed(1) };
    }
  }
}

function addUrl(id, field, value, expectedHost) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || (expectedHost && url.hostname !== expectedHost)) {
      throw new Error("Unexpected URL");
    }
    if (!urls.has(url.href)) urls.set(url.href, []);
    urls.get(url.href).push(`${id} ${field}`);
  } catch {
    failures.push(`${id}: invalid ${field} URL (${value})`);
  }
}

for (const id of Object.keys(universityArticles)) {
  if (!ids.has(id)) failures.push(`${id}: article does not match a catalog ID`);
}

for (const id of ids) {
  if (!Object.hasOwn(universityArticles, id)) {
    failures.push(`${id}: missing article`);
    continue;
  }

  const { lead, facts, sections, sources, photo } = universityArticles[id];
  const paragraphs = articleSections.flatMap(([key]) => {
    const content = sections[key] ?? [];
    if (!content.length || content.some((paragraph) => !paragraph.trim())) {
      failures.push(`${id}: empty section ${key}`);
    }
    return content;
  });
  const wordCount = [lead, ...paragraphs].join(" ").match(words)?.length ?? 0;
  if (wordCount < 300 || wordCount > 450) failures.push(`${id}: ${wordCount} words (expected 300–450)`);
  if (facts.length < 3 || facts.length > 5) failures.push(`${id}: ${facts.length} facts (expected 3–5)`);
  articles.push({ id, sentences: articleSentences([lead, ...paragraphs]) });

  const text = [lead, ...paragraphs, ...facts.flatMap(({ label, value }) => [label, value])].join("\n");
  const match = text.match(forbidden);
  if (match) failures.push(`${id}: forbidden text "${match[0]}"`);

  if (new Set(sources.map(({ url }) => url.trim())).size < 2) failures.push(`${id}: expected at least 2 distinct sources`);
  for (const { title, url } of sources) addUrl(id, `source "${title}"`, url);

  if (photo) {
    if (!licenses.has(photo.license)) failures.push(`${id}: licence not allowed (${photo.license})`);
    if (!photo.author.trim() || /[<>]/.test(photo.author) || !photo.alt.trim()) {
      failures.push(`${id}: missing photo text or HTML in the author credit`);
    }
    if (![photo.width, photo.height].every((n) => Number.isInteger(n) && n > 0)) {
      failures.push(`${id}: invalid photo dimensions`);
    }
    addUrl(id, "photo src", photo.src, "upload.wikimedia.org");
    addUrl(id, "photo filePage", photo.filePage, "commons.wikimedia.org");
  }
}

for (const [index, first] of articles.entries()) {
  for (const second of articles.slice(index + 1)) {
    const overlap = findOverlap(first.sentences, second.sentences);
    if (overlap) {
      const { a, b, percent } = overlap;
      failures.push(`${first.id} / ${second.id}: ${percent}% sentence overlap\n  "${a.text}"\n  "${b.text}"`);
    }
  }
}

const userAgent = "KLabUniversityCatalog/1.0 (University Lab link validation)";
const run = promisify(execFile);

async function request(url, method) {
  try {
    const response = await fetch(url, {
      method,
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
      headers: { "User-Agent": userAgent },
    });
    await response.body?.cancel();
    return { status: response.status, retryAfter: response.headers.get("Retry-After") };
  } catch (error) {
    if (!["UNABLE_TO_VERIFY_LEAF_SIGNATURE", "UNABLE_TO_GET_ISSUER_CERT_LOCALLY"].includes(error.cause?.code)) throw error;

    // Some servers omit an intermediate certificate. Use the platform TLS client
    // when available so local trust and certificate-chain retrieval still apply.
    const { stdout } = await run("curl", [
      "--silent", "--show-error", "--location", "--max-time", "12",
      "--user-agent", userAgent, "--output", "/dev/null", "--write-out", "%{http_code}",
      ...(method === "HEAD" ? ["--head"] : ["--range", "0-0"]),
      "--", url,
    ]);
    return { status: Number(stdout), retryAfter: null };
  }
}

async function checkUrl(url) {
  let failure = "no response";
  for (const method of ["HEAD", "GET", "GET"]) {
    try {
      const { status, retryAfter } = await request(url, method);
      if (status >= 200 && status < 300) return;
      failure = `HTTP ${status}`;
      if (status === 429 || status === 503) {
        const wait = Number(retryAfter) * 1000 || Date.parse(retryAfter) - Date.now() || 2000;
        await setTimeout(Math.min(45_000, Math.max(1000, wait)));
      }
    } catch (error) {
      failure = error.cause?.code ?? error.message;
    }
  }
  failures.push(`${urls.get(url).join(", ")}: ${failure} — ${url}`);
}

const byHost = new Map();
for (const url of urls.keys()) {
  const { hostname } = new URL(url);
  if (!byHost.has(hostname)) byHost.set(hostname, []);
  byHost.get(hostname).push(url);
}
await Promise.all([...byHost.values()].map(async (group) => {
  for (const url of group) await checkUrl(url);
}));

if (failures.length) {
  for (const failure of failures) console.error(failure);
  process.exitCode = 1;
} else {
  const photos = Object.values(universityArticles).filter(({ photo }) => photo).length;
  console.log(`Checked ${ids.size} articles, ${photos} photo licences and ${urls.size} URLs.`);
}
