import { z } from "zod";

const MODEL = "gemini-3.6-flash";
const URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const TIMEOUT_MS = 40_000;
// The model's own reasoning is counted here too, so this must leave room for both.
const MAX_OUTPUT_TOKENS = 4096;

const responseSchema = z.object({
  candidates: z.array(z.object({
    finishReason: z.string().optional(),
    content: z.object({ parts: z.array(z.object({ text: z.string().optional(), thought: z.boolean().optional() })).optional() }).optional(),
  })).optional(),
});

export class GeminiError extends Error {}

/** Drops a sentence the model did not get to finish. */
export function finishedPart(text: string) {
  const end = [...text.matchAll(/[.!?…。](?=["»”')\]]*(?:\s|$))["»”')\]]*/g)].at(-1);
  return end ? text.slice(0, end.index + end[0].length).trim() : "";
}

/** Returns a complete answer or throws: a half-written one is never shown. */
export function readAnswer(body: unknown) {
  const candidate = responseSchema.safeParse(body).data?.candidates?.[0];
  const text = (candidate?.content?.parts ?? []).filter((part) => !part.thought).map((part) => part.text ?? "").join("").trim();
  const answer = candidate?.finishReason === "MAX_TOKENS" ? finishedPart(text) : text;
  if (!answer) throw new GeminiError(`no answer (finishReason: ${candidate?.finishReason ?? "missing"})`);
  return answer;
}

const TRANSIENT = new Set([408, 429, 500, 502, 503, 504]);
const ATTEMPTS = 3;

const wait = (ms: number, signal: AbortSignal) => new Promise<void>((resolve, reject) => {
  if (signal.aborted) return reject(signal.reason);
  const timer = setTimeout(resolve, ms);
  signal.addEventListener("abort", () => { clearTimeout(timer); reject(signal.reason); }, { once: true });
});

/** Gemini is briefly overloaded now and then, so a failed attempt is retried a couple of times before giving up. */
export async function askGemini(apiKey: string, instruction: string, message: string) {
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  let thinking = true;
  const request = () => fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: instruction }] },
      contents: [{ role: "user", parts: [{ text: message }] }],
      generationConfig: { temperature: 0.25, maxOutputTokens: MAX_OUTPUT_TOKENS, ...(thinking && { thinkingConfig: { thinkingLevel: "low" } }) },
    }),
    cache: "no-store",
    signal,
  });

  let lastError: unknown;
  for (let attempt = 0; attempt < ATTEMPTS; attempt++) {
    let delay = 600 * 2 ** attempt;
    try {
      let response = await request();
      // A model that does not know this setting rejects the whole request.
      if (response.status === 400 && thinking) {
        thinking = false;
        response = await request();
      }
      if (response.ok) return readAnswer(await response.json());
      lastError = new GeminiError(`HTTP ${response.status}`);
      if (!TRANSIENT.has(response.status)) break;
      const retryAfter = Number(response.headers.get("retry-after"));
      if (retryAfter > 0) delay = Math.min(retryAfter * 1000, 4000);
    } catch (error) {
      if (signal.aborted) throw new GeminiError("timed out");
      lastError = error;
    }
    if (attempt < ATTEMPTS - 1) await wait(delay, signal).catch(() => { throw new GeminiError("timed out"); });
  }
  throw lastError instanceof Error ? lastError : new GeminiError(String(lastError));
}
