import type { ActionFunction, ActionFunctionArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Form, json, redirect, useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { productSchema } from "~/Validations/productValidation";
import { supabase } from "supabase.server";
import ComboboxDemo from "../components/combobox";
import { fetchCategoriesList, fetchCategoryOrQuantityById, updateCategory } from "~/apis/categories";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog"
import { useState } from "react";
import { getImageUrl, storeProductImage } from "~/apis/product";
import Inputs from "~/components/Inputs";

interface actionData {
    errors?: {
        name?: string[];
        description?: string[];
        price?: string[];
        category_id?: string[];
    };
    message?: string;
}

export const meta: MetaFunction = () => {
    return [
        { title: "Products Control" },
        { name: "description", content: "To handle your products Here" },
    ];
};

export const loader: LoaderFunction = async ({ request }: ActionFunctionArgs) => {
    const data = await fetchCategoriesList();
    return data;
}

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = parseInt((formData.get("price")) as string);
    const file = formData.get("file") as File;
    const categoryId = formData.get("category") as string;


    if (!file || typeof file === "string") {
        return json({ error: "File upload failed" }, { status: 400 });
    }
    try {
        const ProductImage = await getImageUrl(file)
        const validatedData = productSchema.parse({ name, description, price, category_id: categoryId })
        const { data, error: insertError } = await supabase
            .from('ProductsDetail')
            .insert([{ ...validatedData, ProductImage }]);
        const categories = await fetchCategoryOrQuantityById(categoryId);
        const quantity = categories?.quantity;
        const updateData = {
            quantity: quantity + 1
        }
        await updateCategory(categoryId, updateData)

        if (insertError) {
            throw new Error("Failed to post data");
        }
        return redirect("/dashboard/products");
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.flatten().fieldErrors;
            return json({ success: false, errors }, { status: 400 });
        }
    }
};

export default function ProductControl() {
    const [toggle, setToggle] = useState(true)
    const navigate = useNavigate();
    const handleClose = () => {
        setToggle(false)
    }
    const result = useActionData<actionData>();
    console.log(result?.errors?.name?.[0]);

    const { categories } = useLoaderData<typeof loader>();

    return (
        <Dialog open={toggle} onOpenChange={handleClose}>
            <DialogContent onCloseAutoFocus={() => navigate('/dashboard/products')}>
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>
                <Form className="flex justify-center " method="post" encType="multipart/form-data">
                    <div className="grid grid-cols-1  rounded-lg p-32">
                        <Inputs type="text" name="name" id="name" message={result?.errors?.name?.[0]} placeholder="Enter Product Name" />
                        <Inputs type="text" name="description" id="description" message={result?.errors?.description?.[0]} placeholder="Enter Product description" />
                        <Inputs type="text" name="price" id="price" message={result?.errors?.price?.[0]} placeholder="Enter Product price" />
                        <Inputs type="file" name="file" id="file" placeholder="Choose Product Image" accept="image/png, image/gif, image/jpeg" required={true} />
                        <div className="my-3">
                            <ComboboxDemo categories={categories} />
                        </div>
                        {result?.errors?.category_id && (
                            <p className="text-red-500 text-xs -mt-4">
                                {result.errors.category_id}
                            </p>
                        )}
                        <Button type="submit">Add Product</Button>
                    </div>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
