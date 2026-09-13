"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  // До добавления ключей можно спокойно собирать и смотреть дизайн.
  if (!publishableKey) return <>{children}</>;

  return <ClerkProvider publishableKey={publishableKey}>{children}</ClerkProvider>;
}
