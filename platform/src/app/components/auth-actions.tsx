"use client";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export function AuthActions({ showSignUp = true }: { showSignUp?: boolean }) {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) return null;

  return (
    <div className="auth-actions">
      <Show when="signed-out">
        <SignInButton><button className="auth-link" type="button">Войти</button></SignInButton>
        {showSignUp && <SignUpButton><button className="auth-join" type="button">Создать аккаунт</button></SignUpButton>}
      </Show>
      <Show when="signed-in">
        <a className="auth-link" href="/studio">Мой ритм</a>
        <UserButton appearance={{ elements: { avatarBox: "user-avatar" } }} />
      </Show>
    </div>
  );
}
