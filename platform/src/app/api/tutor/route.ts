import { NextResponse } from "next/server";

const legacyTutorUrl = "https://k-lab-two.vercel.app/api/tutor-chat";

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  if (!payload?.message || typeof payload.message !== "string" || payload.message.length > 700) {
    return NextResponse.json({ error: "Напиши короткий вопрос." }, { status: 400 });
  }

  try {
    // The existing Vercel function owns the Gemini key. This platform only
    // forwards the question server-to-server, never exposing any key to users.
    const response = await fetch(legacyTutorUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: payload.message, lessonContext: payload.lessonContext }),
      cache: "no-store",
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "K‑Tutor временно недоступен." }, { status: 502 });
  }
}
