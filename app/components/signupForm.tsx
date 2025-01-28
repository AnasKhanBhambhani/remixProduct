import { Form, Link } from "@remix-run/react";
import { Props } from "~/types";
import Inputs from "./Inputs";
import Button from "./Button";

const SignUpForm = ({ message }: Props) => {
    return (
        <Form className="relative py-3 sm:max-w-xl sm:mx-auto" method="post">
            <div
                className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10"
            >
                <div className="max-w-md mx-auto">
                    <div className="flex items-center space-x-5 justify-center font-semibold text-xl">
                        Product Management System
                    </div>
                    <div className="mt-5">
                        <Inputs id="name" name="name" type="name" label='Name' />
                        <Inputs id="email" name="email" type="email" message={message?.errors?.email} label='Email' />
                        <Inputs id="password" name="password" type="password" message={message?.errors?.password} label='Password' />
                    </div>
                    <div className="mt-5">
                        <Button name="action" value='SignUp' label="Create Your Account" />
                    </div>
                    <div className="flex items-center justify-between mt-4">
                        <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                        <Link
                            className="text-xs text-gray-500  dark:text-gray-400 hover:underline"
                            to="/login"
                        >Already Have an Account</Link>
                        <span className="w-1/5 border-b dark:border-gray-400 md:w-1/4"></span>
                    </div>
                </div>
            </div>
        </Form>
    )
}

export default SignUpForm

