import type { LoaderFunction, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { DataTable } from "../components/categoryTable/categoryTable"
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Customer } from "~/types/customers";
import { fetchCustomers } from "~/apis/customer";

export const meta: MetaFunction = () => {
    return [
        { title: "Your Product Category List" },
        { name: "description", content: "You can watch all the Categories with its products" },
    ];
};

export const loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
    const searchParams = new URL(request.url).searchParams;
    const { page, limit } = Object.fromEntries(searchParams.entries());
    const data = await fetchCustomers(Number(page) || 0, Number(limit) || 5);
    return data;
}

export default function Customers() {
    const navigate = useNavigate();
    const { customers, totalCount } = useLoaderData<typeof loader>();
    const columns: ColumnDef<Customer>[] = [
        {
            accessorKey: "id",
            header: "Customer-ID",
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "email",
            header: "Email",
        },
        {
            accessorKey: "phone",
            header: "Phone",
        },
        {
            accessorKey: "address",
            header: "Address",
        },
    ]
    return (
        <div className="container mx-auto py-10 px-10 ">
            <Outlet />
            <div className="text-3xl mt-3 flex justify-between">
                <h1>Customers</h1>
                <Button onClick={() => navigate('./addcustomer')}>Add Customers</Button>
            </div>
            <div>
                <DataTable columns={columns} data={customers} filter='name' totalCount={totalCount} />
            </div>
        </div>
    );
}
