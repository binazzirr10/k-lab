import { z } from "zod";

// When one model hangs or is overloaded, the next one answers.
const MODELS = ["gemini-3.6-flash", "gemini-3.8-flash", "gemini-3.5-flash-lite"] as const;
const url = (model: string) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
const ATTEMPT_MS = 12_000;
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

const TRANSIENT = new Set([404, 408, 429, 500, 502, 503, 504]);

/** Tries each model in turn, each with its own short time limit, so one hanging model cannot use up the whole wait. */
export async function askGemini(apiKey: string, instruction: string, message: string) {
  const total = AbortSignal.timeout(TIMEOUT_MS);
  let lastError: unknown = new GeminiError("no attempt");
  for (const model of MODELS) {
    if (total.aborted) break;
    const signal = AbortSignal.any([total, AbortSignal.timeout(ATTEMPT_MS)]);
    let thinking = true;
    const request = () => fetch(url(model), {
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
    try {
      let response = await request();
      // A model that does not know this setting rejects the whole request.
      if (response.status === 400 && thinking) {
        thinking = false;
        response = await request();
      }
      if (response.ok) return readAnswer(await response.json());
      lastError = new GeminiError(`${model}: HTTP ${response.status}`);
      if (!TRANSIENT.has(response.status)) break;
    } catch (error) {
      lastError = error instanceof GeminiError ? error : new GeminiError(`${model}: ${signal.aborted ? "timed out" : error instanceof Error ? error.message : "failed"}`);
    }
  }
  throw lastError;
}
