// Runs only on Vercel. The API key stays in Vercel Environment Variables.
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { audioBase64, mimeType, expectedPhrase, browserTranscript } = req.body || {};
  if (!audioBase64 || typeof audioBase64 !== 'string' || audioBase64.length > 7_000_000) {
    return res.status(400).json({ error: 'Нужна короткая аудиозапись (до 7 МБ).' });
  }
  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Ключ Gemini ещё не настроен на сервере.' });
  }

  const prompt = `Ты доброжелательный AI-преподаватель корейского. Пользователь должен произнести: "${expectedPhrase}". Браузер распознал: "${browserTranscript || 'нет текста'}". Прослушай короткую запись. Верни ТОЛЬКО JSON без Markdown: {"aiFeedback":"1–2 коротких предложения по-русски", "practiceTip":"один короткий совет по-русски", "heardTranscript":"корейский текст, который ты услышал"}. Не заявляй, что дал научную фонетическую оценку или точный процент произношения.`;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        contents: [{ parts: [
          { text: prompt },
          { inlineData: { mimeType: mimeType || 'audio/webm', data: audioBase64 } }
        ] }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data?.error?.message || 'Gemini temporarily unavailable');
    const result = JSON.parse(data?.candidates?.[0]?.content?.parts?.map(part => part.text || '').join('').trim());
    return res.status(200).json({
      aiFeedback: String(result.aiFeedback || 'ИИ не смог подготовить отзыв. Повтори попытку.'),
      practiceTip: String(result.practiceTip || 'Повтори фразу медленнее и отчётливее.'),
      heardTranscript: String(result.heardTranscript || browserTranscript || '')
    });
  } catch (error) {
    console.error('Gemini speaking analysis failed:', error.message);
    return res.status(502).json({ error: 'ИИ-анализ сейчас недоступен. Текстовое совпадение всё равно сохранено.' });
  }
}
