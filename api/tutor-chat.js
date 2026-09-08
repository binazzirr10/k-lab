// Vercel serverless function: the Gemini key never reaches the browser.
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { message, lessonContext } = req.body || {};
  if (!message || typeof message !== 'string' || message.length > 700) return res.status(400).json({ error: 'Напиши короткий вопрос.' });
  if (!process.env.GEMINI_API_KEY) return res.status(500).json({ error: 'Gemini ещё не настроен на сервере.' });
  const prompt = `Ты K‑Tutor, доброжелательный преподаватель корейского для начинающих из Казахстана. Контекст текущего урока: ${lessonContext || 'Знакомство: 안녕하세요, 저는 ...이에요/예요.'} Отвечай по-русски просто, точно и максимум в 4 коротких предложениях. Если уместно, добавь 1 корейский пример с переводом. Не придумывай правила и не уходи в сложную грамматику. Вопрос ученика: ${message}`;
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent', {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }], generationConfig: { temperature: 0.35, maxOutputTokens: 300 } })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || 'Gemini unavailable');
    const answer = data?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim();
    return res.status(200).json({ answer: answer || 'Попробуй переформулировать вопрос немного короче.' });
  } catch (error) {
    console.error('Tutor chat failed:', error.message);
    return res.status(502).json({ error: 'K‑Tutor временно недоступен. Попробуй ещё раз позже.' });
  }
}
