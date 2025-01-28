import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { redirect } from "@remix-run/react";
import { createSupabaseServerClient } from "supabase.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Product management System" },
    { name: "description", content: "Product management System" },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { supabaseClient } = createSupabaseServerClient(request)
  const {
    data: { user },
    error,
  } = await supabaseClient.auth.getUser()

  if (!user) {

    return redirect('/login')
  }
  return redirect('dashboard/home')

}