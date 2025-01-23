import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog"
import invariant from 'tiny-invariant'
import { Form, json, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { fetchCategoryById, updateCategoryName } from "~/apis/categories";

export const meta: MetaFunction = () => {
    return [
        { title: "Edit Category" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export const loader: LoaderFunction = async ({ params }) => {
    invariant(params.id, "Id must be present")
    const { categories } = await fetchCategoryById(params.id)
    return json(categories?.[0].category);
}

export const action: ActionFunction = async ({ request, params }) => {
    invariant(params.id, "Id must be present")
    const formData = await request.formData();
    const categoryName = formData.get('category');
    const categoryId = params.id;
    await updateCategoryName(categoryId, categoryName)
    return redirect('/dashboard/categorylist')
}


export default function CategoryEdit() {
    const data = useLoaderData<typeof loader>();
    const [categoryName, setCategoryName] = useState(data);
    const navigate = useNavigate()
    const [toggle, setToggle] = useState(true)
    const handleClose = () => {
        setToggle(false)
    }
    return (
        <Dialog open={toggle} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]" onCloseAutoFocus={() => navigate('/dashboard/categorylist')}>
                <DialogHeader>
                    <DialogTitle>Edit Category Name</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>
                <div className="my-16 w-full gap-5 mx-auto mr-5 flex flex-col">
                    <Form className="flex justify-center w-full" method="post">
                        <Input type="text" name="category" id="category" placeholder="Enter category Name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                        <Button type="submit">Add Category</Button>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
