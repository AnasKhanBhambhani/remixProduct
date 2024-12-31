import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebar } from "../components/app-sidebar";
import { json, Outlet, useLoaderData,} from "@remix-run/react";
import { requireUserSession } from "../session.server";
type Status = {
    status:string,
}
export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};
export const loader: LoaderFunction = async ({ request }) => {
    const logStatus = await requireUserSession(request);
    return json({ status: logStatus });
};
export default function Dashboard() {
    const {status}:Status = useLoaderData<typeof loader>();
    return (
        <SidebarProvider>
            <AppSidebar status={status} />
            <main>
                <SidebarTrigger />
            </main>
            <Outlet />
        </SidebarProvider>
    );
}
