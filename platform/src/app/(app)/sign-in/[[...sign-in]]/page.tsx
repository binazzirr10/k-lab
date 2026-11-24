"use client";
import { AppNav } from "@/app/components/app-nav";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <><AppNav /><main className="auth-note"><p>Вход пока не работает, попробуй позже.</p></main></>;
  }

  return <><AppNav /><main className="auth-page"><SignIn path="/sign-in" signUpUrl="/sign-up" fallbackRedirectUrl="/studio" /></main></>;
}
