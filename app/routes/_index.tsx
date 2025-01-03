import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import Dashboard from "./dashboard";
import { requireUserSession } from "~/session.server";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const isLogin = await requireUserSession(request);
  if (isLogin) {
    return redirect('dashboard/home')
  }
  return redirect('/login')
}