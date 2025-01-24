import { redirect, useActionData } from "@remix-run/react";
import { ActionFunction, ActionFunctionArgs, json } from '@remix-run/node'
import { createSupabaseServerClient } from "supabase.server";
import { z } from "zod";
import SignUp from "~/components/signupForm";
import { signUpSchema } from "~/Validations/signupValidation";
import { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "SignUp | Product management system" },
        { name: "description", content: "SignUp to access the product management system" },
    ];
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const url = new URL(request.url);
    const { supabaseClient, headers } = createSupabaseServerClient(request)
    const formData = await request.formData();
    const authData = Object.fromEntries(formData)

    try {
        const { name, email, password } = signUpSchema.parse(authData)
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    is_approved: true
                },
            },
        })
        if (error) {
            return Response.json(error.code, { status: 400 })
        }


        return redirect(url.searchParams.get('next') || '/', {
            headers,
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.flatten().fieldErrors;
            return json({ success: false, errors }, { status: 400 });
        }
        return Response.json(error, { status: 500 });
    }

}

export default function LoginPage() {
    const actionData = useActionData<typeof action>();
    return (
        <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% w-full flex min-h-svh flex-col  items-center justify-center bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm md:max-w-3xl">
                {<SignUp message={actionData ?? actionData?.errors} />}
            </div>
        </div>

    )

}
