import type { ActionFunction, LoaderFunction, MetaFunction } from "@remix-run/node";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog"
import invariant from 'tiny-invariant'
import { Form, json, useLoaderData, useNavigate } from "@remix-run/react";
import { redirect } from "@remix-run/node";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { fetchProductByCategoryId, fetchProductById, updateProduct } from "~/apis/product";
import { Data, Products } from "~/types/product";
import { productSchema } from "~/Validations/productValidation";
import { DataTable } from "~/components/categoryTable/categoryTable";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
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
    const columns = [
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
            <DialogContent className="sm:max-w-[1425px]" onCloseAutoFocus={() => navigate('/dashboard/categorylist')}>
                <DialogHeader>
                    <DialogTitle>Edit Product Profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>
                <DataTable columns={columns} data={data} />
            </DialogContent>
        </Dialog>
    );
}
