import { ActionFunction, ActionFunctionArgs, json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { deleteProduct, fetchProducts } from "~/apis/product";
import { Form, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { Products } from "~/types/product";
import { Button } from "../components/ui/button";
import { Input } from "~/components/ui/input";
import { z } from "zod";
import { createSupabaseServerClient } from "supabase.server";
import { fetchCategoriesList, fetchQuantityById, updateQuantity } from "~/apis/categories";
import { Pencil, Trash2 } from "lucide-react";
import ComboboxDemo from "~/components/combobox";

export const meta: MetaFunction = () => {
    return [
        { title: "Products" },
        { name: "description", content: "Here is Your Products" },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    const searchParams = new URL(request.url).searchParams;
    const { category } = Object.fromEntries(searchParams.entries())
    console.log(category, 'category');

    const { supabaseClient } = createSupabaseServerClient(request)
    const {
        data: { user },
    } = await supabaseClient.auth.getUser()

    const categoryList = await fetchCategoriesList();
    const { allProducts } = await fetchProducts(category);
    const newData = {
        allProducts,
        categoryList,
        category,
    };
    return json(newData);
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const id = z.string().parse(formData.get('id'));
    const categoryId = z.string().parse(formData.get('categoryId'));
    const categoryList = formData.get("category");
    console.log(categoryList, 'categoryList');
    const categories = await fetchQuantityById(categoryId);
    const quantity = categories.categories?.[0]?.quantity;
    await updateQuantity(categoryId, quantity - 1)
    await deleteProduct(id, categoryId)
    return null;
}

export default function Product() {
    const navigate = useNavigate();
    const { allProducts, category, categoryList } = useLoaderData<typeof loader>();
    let categoryNameById = categoryList?.categories.find((item: any) => item.id == category)
    // console.log(categoryNameById.category, 'categoryListcategoryListcategoryList');
    const handleEdits = (item: Products) => {
        navigate(`./edit/${item.id}`);
    };
    return (
        <div className="py-5 h-full max-w-[1500px] mx-auto">
            <Outlet />
            <div className="my-5">
                <h1 className=" text-3xl px-10">{categoryNameById ? categoryNameById.category : 'All Products'} </h1>
            </div>
            <div className="grid grid-cols-2 my-10  justify-center items-center px-10">
                <div className=" grid grid-cols-2 gap-4">
                    <Input placeholder="Filter Price" className="bg-white" />
                    <ComboboxDemo categories={categoryList.categories} />
                    {/* <Input placeholder="Filter category" className="bg-white" /> */}
                </div>

                <div className=" text-end ">
                    <Button onClick={() => navigate('/dashboard/products/productcontrol')}>Add Products</Button>
                </div>
            </div>
            <div className="flex flex-wrap  p-1 gap-7 justify-center">
                {allProducts?.map((item: Products) => (
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
                                    <Pencil className="text-green-200" />
                                </Button>
                                <Form method="post">
                                    <Button
                                        variant="outline"
                                        type="submit"
                                    >
                                        <Trash2 className="text-red-500" />
                                    </Button>
                                    <Input type="hidden" id="id" name="id" value={String(item.id)} />
                                    <Input type="hidden" id="categoryId" name="categoryId" value={item.category_id} />
                                </Form>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
