import invariant from "tiny-invariant";
import { createClient } from "@supabase/supabase-js";
import { createServerClient, parse, serialize } from '@supabase/ssr'

invariant(process.env.SUPABASE_URL, "Missing SUPABASE_URL");
invariant(process.env.SUPABASE_ANON_KEY, "Missing SUPABASE_ANON_KEY");

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

export const createSupabaseServerClient = (request: Request) => {
  const cookies = parse(request.headers.get('Cookie') ?? '')
  const headers = new Headers()
  const supabaseClient = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(key) {
          return cookies[key]
        },
        set(key, value, options) {
          headers.append('Set-Cookie', serialize(key, value, options))
        },
        remove(key, options) {
          headers.append('Set-Cookie', serialize(key, '', options))
        },
      },
    },
  )
  return { supabaseClient, headers }
}
