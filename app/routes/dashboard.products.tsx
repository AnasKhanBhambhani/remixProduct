import { ActionFunction, ActionFunctionArgs, json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { Card } from "../components/ui/card";
import { deleteProduct, fetchProducts } from "~/apis/product";
import { Form, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { Products } from "~/types/product";
import { Button } from "../components/ui/button";
import { requireUserSession } from "~/session.server";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { createSupabaseServerClient } from "supabase.server";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    const { supabaseClient } = createSupabaseServerClient(request)
    const {
        data: { user },
    } = await supabaseClient.auth.getUser()
    const data = await fetchProducts();
    const newData = {
        ...data,
    };
    return json(newData);
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const id = z.string().parse(formData.get('id'));
    const error = deleteProduct(id)
    if (error) {
        return error
    }
    return null;
}
export default function Product() {
    const navigate = useNavigate();
    const data = useLoaderData<typeof loader>();
    const handleEdits = (item: Products) => {
        navigate(`./edit/${item.id}`);
    };
    return (
        <div className=" my-16 w-full h-full max-w-[1500px] mx-auto mr-5">
            <Outlet />
            <div className="grid grid-cols-2  justify-center items-center px-10">
                <h1 className=" text-3xl my-10 ">Your Products</h1>
                <div className=" text-end">
                    <Button onClick={() => navigate('/dashboard/productcontrol')}>Add products</Button>
                </div>
            </div>
            <div className="flex flex-wrap  p-1 gap-7 justify-center">
                {data?.data.map((item: Products) => (
                    <div
                        key={item.id}
                        className="relative my-2 flex w-72 justify-between flex-col rounded-xl bg-gradient-to-br from-white to-gray-50 bg-clip-border text-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                        <div
                            className="relative mx-4 -mt-7 h-40 overflow-hidden rounded-xl bg-clip-border shadow-lg group"
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 opacity-90"
                            ></div>
                            <div
                                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px] animate-pulse"
                            ></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <img src={item.ProductImage} alt="" className="w-full" />
                            </div>
                        </div>
                        <div className="p-6">
                            <h5
                                className="mb-2 block font-sans text-xl font-semibold leading-snug tracking-normal text-gray-900 antialiased group-hover:text-blue-600 transition-colors duration-300"
                            >
                                Name: {item.name}
                            </h5>
                            <p
                                className="block font-sans text-base font-light leading-relaxed text-gray-700 antialiased"
                            >
                                Description: {item.description}
                            </p>
                            <p
                                className="block font-sans text-base font-light leading-relaxed text-gray-700 antialiased"
                            >
                                Price: {item.price}
                            </p>
                        </div>

                        <div className="p-6 pt-0">
                            <div className="gap-2 flex">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        handleEdits(item);
                                    }}
                                >
                                    Edit Product
                                </Button>
                                <Form method="post">
                                    <Button
                                        className="bg-red-600"
                                        variant="outline"
                                        type="submit"
                                    >
                                        Delete Product
                                    </Button>
                                    <Input type="hidden" id="id" name="id" value={String(item.id)} />
                                </Form>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
