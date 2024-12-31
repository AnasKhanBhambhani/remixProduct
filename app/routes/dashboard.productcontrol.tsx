import type { ActionFunction, ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Form, json, redirect, useActionData } from "@remix-run/react";
import { productSchema } from "~/Validations/productValidation";
import { z } from "zod";
import { supabase } from "supabase.server";
interface actionData {
    errors?: {
        name?: { _errors: string[] };
        description?: { _errors: string[] };
        price?: { _errors: string[] };
        fileName?: { _errors: string[] };
    };
    message?: string;
}
export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const file = formData.get("file");
    if (!file || typeof file === "string") {
        return json({ error: "File upload failed" }, { status: 400 });
    }

    const img = file as File;
    if (!img) {
        return { error: 'Image file is required' };
    }
    const fileBuffer = await img.arrayBuffer();
    const fileUpload = `${Date.now()}-${img.name}`
    const { error } = await supabase.storage
        .from('ProductImages')
        .upload(fileUpload, new Uint8Array(fileBuffer), {
            contentType: file.type,
            upsert: false,
        });

    if (error) {
        console.error(error, 'dddd');
        return { error: error.message };
    }

    const { data: fileName } = await supabase.storage
        .from('ProductImages')
        .getPublicUrl(fileUpload);
    const ProductImage = fileName.publicUrl;
  
    try {
        const validatedData = productSchema.parse({ name, description, price })
        const response = await fetch("http://localhost:3001/products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ ...validatedData, ProductImage}),
        });
        if (!response.ok) {
            throw new Error("Failed to post data");
        }
        return redirect('/dashboard/products');
    } catch (error) {
        if (error instanceof z.ZodError) {
            const validationErrors = error.format();
            return { errors: validationErrors };
        }
        throw error;
    }
};

export default function Product() {
    const result = useActionData<actionData>();
    // const { v4: uuidv4 } = require('uuid');
    return (
        <div className="my-16 w-full h-full max-w-[1500px] gap-5 mx-auto mr-5 flex flex-col justify-center">
            <div className="flex justify-center">
                <h1 className="text-2xl">Product Control</h1>
            </div>
            <Form className="flex justify-center" method="post" encType="multipart/form-data">
                <div className="flex gap-10 w-[50%] flex-col bg-slate-100 rounded-lg p-32">
                    <Input type="text" name="name" id="name" placeholder="Enter Product Name" />
                    {result?.errors?.name && (
                        <p className="text-red-500 text-xs">
                            {result.errors.name._errors[0]}
                        </p>
                    )}
                    <Input type="text" name="description" id="description" placeholder="Enter Product Description" />
                    {result?.errors?.description && (
                        <p className="text-red-500 text-xs">
                            {result.errors.description._errors[0]}
                        </p>
                    )}
                    <Input type="text" name="price" id="price" placeholder="Enter Product Price" />
                    {result?.errors?.price && (
                        <p className="text-red-500 text-xs">
                            {result.errors.price._errors[0]}
                        </p>
                    )}
                    <Input type="file" name="file" id="file" placeholder="Choose Product Image" />
                    {result?.errors?.fileName && (
                        <p className="text-red-500 text-xs bg-orange-300">
                            {result.errors.fileName._errors[0]}
                        </p>
                    )}

                    <Button type="submit">Add Product</Button>
                </div>
            </Form>
        </div>
    );
}
