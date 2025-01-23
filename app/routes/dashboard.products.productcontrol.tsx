import type { ActionFunction, ActionFunctionArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Form, json, redirect, useActionData, useLoaderData, useNavigate } from "@remix-run/react";
import { productSchema } from "~/Validations/productValidation";
import { supabase } from "supabase.server";
import ComboboxDemo from "../components/combobox";
import { fetchCategoriesList, fetchCategoriesName, fetchQuantityById, updateQuantity } from "~/apis/categories";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog"
import { useState } from "react";

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
    // const data = await fetchCategoriesName();
    const data = await fetchCategoriesList();
    return data;
}

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = parseInt((formData.get("price")) as string);
    const file = formData.get("file");
    const categoryId = formData.get("category");


    if (!file || typeof file === "string") {
        return json({ error: "File upload failed" }, { status: 400 });
    }
    try {
        const img = file as File;
        const fileBuffer = await img.arrayBuffer();
        const fileUpload = `${Date.now()}-${img.name}`
        const { error: uploadError } = await supabase.storage
            .from('ProductImages')
            .upload(fileUpload, new Uint8Array(fileBuffer), {
                contentType: file.type,
                upsert: false,
            });

        if (uploadError) {
            throw new Error(`File upload failed: ${uploadError.message}`);
        }
        const { data: fileName } = await supabase.storage
            .from('ProductImages')
            .getPublicUrl(fileUpload);
        const ProductImage = await fileName.publicUrl;
        const validatedData = productSchema.parse({ name, description, price, category_id: categoryId })
        const { data, error: insertError } = await supabase
            .from('ProductsDetail')
            .insert([{ ...validatedData, ProductImage }]);

        const categories = await fetchQuantityById(categoryId);
        const quantity = categories.categories?.[0]?.quantity;
        await updateQuantity(categoryId, quantity + 1)

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
                    <div className="grid grid-cols-1 gap-5  rounded-lg p-32">
                        <Input type="text" name="name" id="name" placeholder="Enter Product Name" />
                        {result?.errors?.name && (
                            <p className="text-red-500 text-xs -mt-4">
                                {result.errors.name}
                            </p>
                        )}
                        <Input type="text" name="description" id="description" placeholder="Enter Product Description" />
                        {result?.errors?.description && (
                            <p className="text-red-500 text-xs">
                                {result.errors.description}
                            </p>
                        )}
                        <Input type="text" name="price" id="price" placeholder="Enter Product Price" />
                        {result?.errors?.price && (
                            <p className="text-red-500 text-xs -mt-4">
                                {result.errors.price}
                            </p>
                        )}
                        <Input type="file" name="file" id="file" placeholder="Choose Product Image" accept="image/png, image/gif, image/jpeg" required />
                        <ComboboxDemo categories={categories} />
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
