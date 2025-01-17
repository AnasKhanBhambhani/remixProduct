import { LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { json, Outlet, useLoaderData, } from "@remix-run/react";
import { requireUserSession } from "../session.server";
import { createSupabaseServerClient, supabase } from "supabase.server";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    const { supabaseClient } = createSupabaseServerClient(request)
    const url = new URL(request.url);
    const {
        data: { user },
    } = await supabaseClient.auth.getUser()
    if (!user) {
        return redirect(`/login?next=${url.pathname}`)
    }
    
        return json({ user });

};

export default function Dashboard() {
    const { status, user } = useLoaderData<typeof loader>();
    return (
        <SidebarProvider>
            <AppSidebar  />
            <main>
                <SidebarTrigger />
            </main>
            <Outlet context={user?.email} />
        </SidebarProvider>
    );
}
