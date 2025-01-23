import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog"
import invariant from 'tiny-invariant'
import { json, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { fetchProductByCategoryId } from "~/apis/product";
import { Data, Products } from "~/types/product";
import { DataTable } from "~/components/categoryTable/categoryTable";
import { ColumnDef } from "@tanstack/react-table";

export const meta: MetaFunction = () => {
    return [
        { title: "Category" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export const loader: LoaderFunction = async ({ params }) => {
    invariant(params.id, "Id must be present")
    const data = await fetchProductByCategoryId(params.id)
    return json(data);
}



export default function Product() {
    const { data, error }: Data = useLoaderData();
    const navigate = useNavigate()
    const [toggle, setToggle] = useState(true)
    const handleClose = () => {
        setToggle(false)
    }

    const columns: ColumnDef<Products>[] = [
        {
            accessorKey: "id",
            header: "ID",
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "Image",
            header: "ProductImage",
            cell: ({ row }) => {
                return <img src={row.original.ProductImage} alt="" className="w-16 h-16" />
            },
        },
        {
            accessorKey: "price",
            header: "Price",
        },
    ]

    return (
        <Dialog open={toggle} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]" onCloseAutoFocus={() => navigate('/dashboard/categorylist')}>
                <DialogHeader>
                    <DialogTitle>Edit Product Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>
                <DataTable columns={columns} data={data} filter='name' />
            </DialogContent>
        </Dialog>
    );
}
