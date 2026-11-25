// Vercel serverless function: the Gemini key never reaches the browser.
export const config = { maxDuration: 60 };

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message, lessonContext } = req.body || {};
  if (!message || typeof message !== 'string' || message.length > 700) return res.status(400).json({ error: 'Напиши короткий вопрос.' });
  if (lessonContext != null && (typeof lessonContext !== 'string' || lessonContext.length > 1024)) {
    return res.status(400).json({ error: 'Напиши короткий вопрос.' });
  }
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'Gemini ещё не настроен на сервере.' });
  const prompt = `Ты K‑Tutor, доброжелательный преподаватель корейского для начинающих из Казахстана. Контекст текущего урока: ${lessonContext || 'Знакомство: 안녕하세요, 저는 ...이에요/예요.'} Отвечай по-русски просто, точно и ЗАКАНЧИВАЙ мысль полностью. Максимум 4 коротких предложения. Если уместно, добавь один корейский пример с переводом. Не придумывай правила и не уходи в сложную грамматику. Вопрос ученика: ${message}`;
  try {
    const signal = AbortSignal.timeout(25_000);
    // The model's reasoning counts toward maxOutputTokens, so a small limit cuts answers off.
    const ask = (thinking) => fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.25, maxOutputTokens: 4096, ...thinking } }),
      signal
    });
    let response = await ask({ thinkingConfig: { thinkingLevel: 'low' } });
    if (response.status === 400) response = await ask();
    if (!response.ok) throw new Error(`Gemini HTTP ${response.status}`);
    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.filter(part => !part.thought).map(part => part.text || '').join('').trim();
    return res.status(200).json({ answer: answer || 'Попробуй переформулировать вопрос немного короче.' });
  } catch {
    console.error('Tutor chat failed');
    return res.status(502).json({ error: 'K‑Tutor временно недоступен. Попробуй ещё раз позже.' });
  }
}
