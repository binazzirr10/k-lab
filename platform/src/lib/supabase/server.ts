import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) {
    throw new Error("Supabase environment variables are not configured.");
  }

  return { url, publishableKey };
}

// Clerk remains the only authentication provider. This client only passes the
// current Clerk session token to Supabase so RLS can protect every row.
export async function createServerSupabaseClient() {
  const { url, publishableKey } = getSupabaseConfig();
  const { getToken } = await auth();

  return createClient(url, publishableKey, {
    accessToken: async () => getToken(),
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
