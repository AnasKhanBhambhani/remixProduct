import type { ActionFunction, ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Form, redirect, useActionData, useNavigate } from "@remix-run/react";
import { insertCategory } from "~/apis/categories";
import { AddCategory } from "~/types/categories";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog"
import { useState } from "react";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};



export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const category = formData.get('category');
    // const { data, error } = await insertCategory(formData);
    console.log(category, 'ddddd');

    // if (data) {
    //     return redirect('/dashboard/categorylist')
    // }
    return category
};

export default function Product() {
    const [toggle, setToggle] = useState(true)
    const navigate = useNavigate();
    const handleClose = () => {
        setToggle(false)
    }
    const result = useActionData<typeof action>();
    return (
        <Dialog open={toggle} onOpenChange={handleClose}>
            <DialogContent onCloseAutoFocus={() => navigate(-1)}>
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>
                <div className="my-16 w-full gap-5 mx-auto mr-5 flex flex-col">
                    <Form className="flex justify-center w-full" method="post">
                        <Input type="text" name="category" id="category" placeholder="Enter category Name" />
                        {result?.errors?.name && (
                            <p className="text-red-500 text-xs">
                                {result.errors.name._errors[0]}
                            </p>
                        )}
                        <Button type="submit">Add Product</Button>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
