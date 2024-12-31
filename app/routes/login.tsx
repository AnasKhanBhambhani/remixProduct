import { redirect, useActionData } from "@remix-run/react";
import { ActionFunction, ActionFunctionArgs } from '@remix-run/node'

import { LoginForm } from "../components/ui/loginForm"
import { commitSession, getSession } from "../session.server";

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const email = formData.get('email');
    const password = formData.get('password');
    const admin = {
        email: 'anashamza457@gmail.com',
        password: '12345',
    }
    const user = {
        email: 'anas@gmail.com',
        password: '12345',
    }
    if (admin.email === email && admin.password === password) {
        const session = await getSession();
        session.set('status', 'admin');
        return redirect("/dashboard/home", {
            headers: { "Set-Cookie": await commitSession(session) },
        });
    }
    else if(user.email === email && user.password === password){
        const session = await getSession();
        session.set('status', 'user');
        return redirect("/dashboard/home", {
            headers: { "Set-Cookie": await commitSession(session) },
        });
    } else {
        return { error: "Invalid credentials" };
    }
}


export default function LoginPage() {
    const actionData = useActionData<typeof action>();
    return (
        <div className="w-full flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="text-red-500 my-2">{actionData?.error}</div>
            <div className="w-full max-w-sm md:max-w-3xl">
                <LoginForm />
            </div>
        </div>
    )
}
