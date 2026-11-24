"use client";
import { AppNav } from "@/app/components/app-nav";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return <><AppNav /><main className="auth-note"><p>Регистрация пока не работает, попробуй позже.</p></main></>;
  }

  return <><AppNav /><main className="auth-page"><SignUp path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/studio" /></main></>;
}
