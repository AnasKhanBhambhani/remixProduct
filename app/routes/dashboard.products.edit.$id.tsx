import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog"
import invariant from 'tiny-invariant'
import { Form, json, useLoaderData, useNavigate } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { fetchProductById, updateProduct } from "~/apis/product";
import { Data, Products } from "~/types/product";
import { productSchema } from "~/Validations/productValidation";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export const loader: LoaderFunction = async ({ params }) => {
    invariant(params.id, "Id must be present")
    const data = await fetchProductById(params.id)
    return json(data);
}

export const action: ActionFunction = async ({ params, request }) => {
    invariant(params.id, 'Missing Params Id')
    const formData = await request.formData();
    const UpdatedData = Object.fromEntries(formData)
    const validatedData = productSchema.parse(UpdatedData)
    await updateProduct(params.id, validatedData)
    return redirect('/dashboard');
}

export default function Product() {
    const { data, error }: Data = useLoaderData();
    const navigate = useNavigate()
    const [toggle, setToggle] = useState(true)
    const handleClose = () => {
        setToggle(false)
    }
    return (
        <Dialog open={toggle} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[425px]" onCloseAutoFocus={() => navigate('/dashboard/products')}>
                <DialogHeader>
                    <DialogTitle>Edit Product Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>
                {error ? <h1>There is an error while fetching Data...</h1> :
                    <Form method="post">
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right">
                                    Name
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    defaultValue={data[0]?.name || ''}
                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Description
                                </Label>
                                <Input
                                    id="description"
                                    name="description"
                                    defaultValue={data[0]?.description || ''}

                                    className="col-span-3"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="username" className="text-right">
                                    Price
                                </Label>
                                <Input
                                    id="price"
                                    name="price"
                                    defaultValue={data[0]?.price || ''}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </Form>
                }
            </DialogContent>
        </Dialog>
    );
}
