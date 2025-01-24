import type { LoaderFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { DataTable } from "../components/categoryTable/categoryTable"
import { Form, Link, Outlet, ShouldRevalidateFunctionArgs, useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import { fetchCategories } from "~/apis/categories";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { Products } from "~/types/product";

export const meta: MetaFunction = () => {
    return [
        { title: "Your Product Category List" },
        { name: "description", content: "You can watch all the Categories with its products" },
    ];
};

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
    const searchParams = new URL(request.url).searchParams;
    const { page, limit, search } = Object.fromEntries(searchParams.entries());
    const data = await fetchCategories(Number(page) || 0, Number(limit) || 5, search);
    return data;
}

// export function shouldRevalidate({ defaultShouldRevalidate, currentParams }: ShouldRevalidateFunctionArgs) {
//     if ('id' in currentParams && currentParams.id) {
//         return false;
//     };
//     return defaultShouldRevalidate;
// }

export default function Categories() {
    const navigate = useNavigate();
    const categories = useLoaderData<typeof loader>();
    const columns: ColumnDef<Products>[] = [
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => {
                return <Link to={`/dashboard/products/?category=${row.original.id}`} className="cursor-pointer underline text-blue-500">{row?.getValue('category')}</Link>
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
                    <div className="flex gap-3 bg-white">
                        <Form method="post" className="flex gap-2" action="/category/delete">
                            <Input type="hidden" value={categoryId} name="categoryid" />
                            <Button type="submit" variant={"destructive"} key={categoryId}>
                                Delete
                            </Button>
                        </Form>
                        <Button
                            onClick={() => navigate(`./edit/${categoryId}`)}
                        > Update Category</Button>
                    </div>
                )
            },
        },
    ]
    return (
        <div className="container mx-auto py-10 px-10 ">
            <Outlet />
            <div className="text-3xl mt-3 flex justify-between">
                <h1>Categories</h1>
                <Button onClick={() => navigate('./insertcategory')}>Add Category</Button>
            </div>
            <div>
                <DataTable columns={columns} data={categories?.categories} filter='category' totalCount={categories?.totalCount} />
            </div>
        </div>
    );
}
