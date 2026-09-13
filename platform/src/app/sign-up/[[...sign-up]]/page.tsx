"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <main className="auth-note"><p>Сначала добавь ключи Clerk в файл <code>.env.local</code>.</p></main>;
  }

  return <main className="auth-page"><SignUp path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/studio" /></main>;
}
