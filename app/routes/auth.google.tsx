import { json, redirect } from "@remix-run/node";
import { createSupabaseServerClient, supabase } from "supabase.server";


export const action = async ({ request }: { request: Request }) => {
    const { supabaseClient, headers } = createSupabaseServerClient(request)
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
            queryParams: {
                access_type: 'offline',
                prompt: 'consent',
            },
            redirectTo: 'http://localhost:5173/auth/callback',
            // shouldCreateUser: true,
        } as any,
    })

    if (error) {
        return json({ error: error.message }, { status: 400 });
    }

    if (data.url) {
        return redirect(data.url, { headers });
    }

    return null;
}
