/** Sign-in that returns the student to the page they were trying to open. Only paths on this site are accepted. */
export function signInFor(path: string) {
  const safe = path.startsWith("/") && !path.startsWith("//") ? path : "/studio";
  return `/sign-in?redirect_url=${encodeURIComponent(safe)}`;
}
