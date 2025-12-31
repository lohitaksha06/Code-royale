import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY (see frontend/.env.local.example).",
  );
}

export const createSupabaseServerClient = () => {
  const cookieStore = cookies();

  return createServerClient(supabaseUrl.replace(/\/+$/, ""), supabaseAnonKey, {
    cookies: {
      get: (name) => cookieStore.get(name)?.value,
      set: (name, value, options) => {
        cookieStore.set({ name, value, ...options });
      },
      remove: (name, options) => {
        cookieStore.delete({ name, ...options });
      },
    },
  });
};

