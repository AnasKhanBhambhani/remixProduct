import { redirect } from "@remix-run/node";
import { destroySession, getSession } from "../session.server";
import { createSupabaseServerClient } from "supabase.server";

export const action = async ({ request }: { request: Request }) => {
    const { supabaseClient, headers } = createSupabaseServerClient(request);
    await supabaseClient.auth.signOut();
    return redirect('/login', {
        headers,
    });
};
