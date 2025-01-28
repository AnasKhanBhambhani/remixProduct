import { Form, Link } from "@remix-run/react";
import { Props } from "~/types";
import Inputs from "./input";
import Button from "./button";
import GoogleSvg from "./googleSvg";

const LoginForm = ({ message }: Props) => {
    return (
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
            <div
                className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10"
            >
                <Form method="post">
                    <div className="max-w-md mx-auto">
                        <div className="flex items-center space-x-5 justify-center font-semibold text-xl">
                            Product Management System
                        </div>
                        <div className="mt-5">
                            <Inputs id="email" name="email" type="email" message={message?.errors?.email} label='Email' />
                            <Inputs id="password" name="password" type="password" message={message?.errors?.password} label='Password' />
                        </div>
                        <div className="mt-5">
                            <Button name="action" value='login' label="Log In" />
                        </div>
                        <div className="flex items-center justify-between mt-4">
                            <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                            <Link
                                className="text-xs text-gray-500 uppercase dark:text-gray-400 hover:underline"
                                to="/signup"
                            >or sign up</Link>
                            <span className="w-1/5 border-b dark:border-gray-400 md:w-1/4"></span>
                        </div>
                    </div>
                </Form>
                <br />
                <Form method="post" action="/auth/google">
                    <div className="flex justify-center w-full items-center">
                        <div>
                            <button
                                type="submit"
                                name="action"
                                value='google'

                                className="flex items-center justify-center py-2 px-20 bg-white hover:bg-gray-200 focus:ring-blue-500 focus:ring-offset-blue-200 text-gray-700 w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                            >
                                <GoogleSvg />
                                <span className="ml-2">Sign in with Google</span>
                            </button>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    )
}

export default LoginForm

