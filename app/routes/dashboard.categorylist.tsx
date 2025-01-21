import type { LoaderFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { DataTable } from "../components/categoryTable/categoryTable"
import { Form, Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { DeleteQuantity, fetchCategories } from "~/apis/categories";
import { MoreHorizontal } from "lucide-react"
import { Button } from "~/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"

export const meta: MetaFunction = () => {
    return [
        { title: "Your Product Category List" },
        { name: "description", content: "You can watch all the Categories with its products" },
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
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const categoryId = row.original.id

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                                <Form method="post">
                                    <Button type="submit">
                                        Delete Category
                                    </Button>
                                </Form>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => navigate(categoryId)}
                            >Update Category</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
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
