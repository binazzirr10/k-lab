"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Show, UserButton } from "@clerk/nextjs";
import { signInFor } from "@/lib/sign-in";

/** Our own sign-in and sign-up pages, never Clerk's hosted ones, and back to this page afterwards. */
export function AuthActions({ showSignUp = true }: { showSignUp?: boolean }) {
  const pathname = usePathname();
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;
  const back = pathname.startsWith("/sign-") ? "/studio" : pathname;

  return (
    <div className="auth-actions">
      <Show when="signed-out">
        <Link className="auth-link" href={signInFor(back)}>Войти</Link>
        {showSignUp && <Link className="auth-join" href={`/sign-up?redirect_url=${encodeURIComponent(back)}`}>Создать аккаунт</Link>}
      </Show>
      <Show when="signed-in">
        <Link className="auth-link" href="/studio">Мой ритм</Link>
        <UserButton appearance={{ elements: { avatarBox: "user-avatar" } }} />
      </Show>
    </div>
  );
}
