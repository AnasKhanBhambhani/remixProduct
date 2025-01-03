import invariant from "tiny-invariant";
import { createClient } from "@supabase/supabase-js";

invariant(process.env.SUPABASE_URL, "Missing SUPABASE_URL");
invariant(process.env.SUPABASE_ANON_KEY, "Missing SUPABASE_ANON_KEY");

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);
