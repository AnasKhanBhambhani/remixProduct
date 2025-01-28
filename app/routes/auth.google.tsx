import { json, redirect } from "@remix-run/node";
import { SignInWithOAuthCredentials } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "supabase.server";


export const action = async ({ request }: { request: Request }) => {
    const { supabaseClient, headers } = createSupabaseServerClient(request)
    const options: SignInWithOAuthCredentials["options"] = {
        queryParams: {
            access_type: "offline",
            prompt: "consent",
        },
        redirectTo: "http://localhost:5173/auth/callback",
    };
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options,
    })
    if (error) {
        return json({ error: error.message }, { status: 400 });
    }
    if (data.url) {
        return redirect(data.url, { headers });
    }
    return null;
}
