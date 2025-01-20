import type { LoaderFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { DataTable } from "../components/categoryTable/categoryTable"
import { Link, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { fetchCategories } from "~/apis/categories";
import { Button } from "~/components/ui/button";
export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
    const data = await fetchCategories();

    return data;

}

export default function Product() {
    const navigate = useNavigate();
    const categories = useLoaderData<typeof loader>();

    const columns = [
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => {
                return <div className="cursor-pointer" onClick={() => { navigate(`${row.original.id}`) }}>{row.getValue('category')}</div>
            },
        },
        {
            accessorKey: "quantity",
            header: "Quantity",
        },
        {
            accessorKey: "sold",
            header: "Sold",
        },
    ]

    const data = [
        {
            id: 1,
            category: "Electronics",
            quantity: 100,
            sold: 23,
        },
        {
            id: 2,
            category: "Garments",
            quantity: 200,
            sold: 43,
        },

    ]
    return (
        <div className="container mx-auto py-10 px-10">
            <Outlet />
            <div className="text-3xl mt-3 flex justify-between">
                <h1>Categories</h1>
                <Button onClick={() => navigate('./insertcategory')}>Add Category</Button>
            </div>
            <div>
                <DataTable columns={columns} data={categories?.categories} />
            </div>
        </div>
    );
}
