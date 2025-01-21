import type { ActionFunction, ActionFunctionArgs, LoaderFunction, MetaFunction } from "@remix-run/node";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Form, json, redirect, useActionData, useLoaderData } from "@remix-run/react";
import { productSchema } from "~/Validations/productValidation";
import { supabase } from "supabase.server";
import ComboboxDemo from "../components/combobox";
import { fetchCategories, fetchQuantityById, updateQuantity } from "~/apis/categories";

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
        { title: "Products Control" },
        { name: "description", content: "To handle your products Here" },
    ];
};

export const loader: LoaderFunction = async ({ request }: ActionFunctionArgs) => {
    const data = await fetchCategories();
    return data;
}

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
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
        const validatedData = productSchema.parse({ name, description, price: parseInt(price as string), category_id: categoryId })

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
    } catch (insertError) {
        return json({ error: insertError || "Unknown error" }, { status: 500 });
    }
};

export default function Product() {
    const result = useActionData<actionData>();
    const { categories } = useLoaderData<typeof loader>();
    return (
        <div className="my-16 w-full h-full max-w-[1500px] gap-5 mx-auto mr-5 flex flex-col justify-center">
            <div className="flex justify-center">
                <h1 className="text-2xl">Product Control</h1>
            </div>
            <Form className="flex justify-center" method="post" encType="multipart/form-data">
                <div className="grid grid-cols-1 gap-10 bg-slate-100 rounded-lg p-32">
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
                    <ComboboxDemo categories={categories} />
                    <Button type="submit">Add Product</Button>
                </div>
            </Form>
        </div>
    );
}
