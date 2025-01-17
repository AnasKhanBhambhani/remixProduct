import { redirect, useActionData } from "@remix-run/react";
import { ActionFunction, ActionFunctionArgs, json } from '@remix-run/node'
import { LoginForm } from "../components/ui/loginForm"
import { createSupabaseServerClient } from "supabase.server";
import { object, z } from "zod";
import { authSchema } from "~/Validations/AuthValidation";



export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const url = new URL(request.url);
    const { supabaseClient, headers } = createSupabaseServerClient(request)
    const formData = await request.formData();
    const authData = Object.fromEntries(formData)
    try {
       const validatedData =  authSchema.parse(authData)
        const { data, error } = await supabaseClient.auth.signInWithPassword(validatedData);
        if (error) {
            return error.code
        }
        return redirect(url.searchParams.get('next') || '/', {
            headers,
        });
    } catch (err) {
        if (err instanceof z.ZodError) {
            const errors = err.flatten().fieldErrors;
            return json({ success: false, errors }, { status: 400 });
        }
        throw err;
    }
 

}


export default function LoginPage() {
    const actionData = useActionData<typeof action>();
    return (
        <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% w-full flex min-h-svh flex-col  items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                <LoginForm message={actionData ?? actionData?.errors} />
            </div>
        </div>

    )

}
