import type { ActionFunction, ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Form, redirect, useActionData } from "@remix-run/react";
import { insertCategory } from "~/apis/categories";
import { AddCategory } from "~/types/categories";


export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};



export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const { data, error } = await insertCategory(formData);
    if (data) {
        return redirect('/dashboard/categorylist')
    }
    return data
};

export default function Product() {
    const result = useActionData<typeof action>();
    return (
        <div className="my-16 w-full h-full max-w-[1500px] gap-5 mx-auto mr-5 flex flex-col justify-center">
            <div className="flex justify-center">
                <h1 className="text-2xl">Add Category</h1>
            </div>
            <Form className="flex justify-center" method="post">
                <div className="grid grid-cols-1 gap-10 bg-slate-100 rounded-lg p-32">
                    <Input type="text" name="name" id="name" placeholder="Enter category Name" />
                    {result?.errors?.name && (
                        <p className="text-red-500 text-xs">
                            {result.errors.name._errors[0]}
                        </p>
                    )}
                    <Input type="text" name="quantity" id="quantity" placeholder="Enter category quantity" />
                    {result?.errors?.description && (
                        <p className="text-red-500 text-xs">
                            {result.errors.description._errors[0]}
                        </p>
                    )}
                    <Button type="submit">Add Product</Button>
                </div>
            </Form>
        </div>
    );
}
