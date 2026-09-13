"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <main className="auth-note"><p>Сначала добавь ключи Clerk в файл <code>.env.local</code>.</p></main>;
  }

  return <main className="auth-page"><SignIn path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/studio" /></main>;
}
