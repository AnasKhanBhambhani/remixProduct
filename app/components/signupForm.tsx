import { Form, Link } from "@remix-run/react";
import { Props } from "~/types";


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
                        <label
                            className="font-semibold text-sm text-gray-600 pb-1 block"
                            htmlFor="login"
                        >Name:</label
                        >
                        <input
                            className="border rounded-lg bg-white px-3 py-2 mt-1 text-sm w-full"
                            id="name"
                            name="name"
                            type="name"
                            required
                        />
                        <div className="text-red-500 text-xs mb-5"> {message?.errors?.email || ''}</div>


                        <label
                            className="font-semibold text-sm text-gray-600 pb-1 block"
                            htmlFor="login"
                        >E-mail</label
                        >
                        <input
                            className="border rounded-lg bg-white px-3 py-2 mt-1 text-sm w-full"
                            id="email"
                            name="email"
                            type="email"
                            required
                        />
                        <div className="text-red-500 text-xs mb-5"> {message?.errors?.email || ''}</div>
                        <label
                            className="font-semibold text-sm text-gray-600 pb-1 block"
                            htmlFor="password">Password</label>
                        <input
                            className="border bg-white rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                            id="password" name="password" type="password" required
                        />
                        <div className="text-red-500 text-xs mb-5"> {message?.errors?.password || ''}</div>

                    </div>

                    <div className="mt-5">
                        <button
                            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
                            type="submit"
                        >
                            Create your Account
                        </button>
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

