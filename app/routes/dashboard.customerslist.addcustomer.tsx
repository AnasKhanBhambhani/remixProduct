import type { ActionFunction, ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Form, json, redirect, useActionData, useNavigate } from "@remix-run/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../components/ui/dialog"
import { useState } from "react";
import { customerSchema } from "~/Validations/customerValidation";
import { z, ZodError } from "zod";
import { addCustomer } from "~/apis/customer";

export const meta: MetaFunction = () => {
    return [
        { title: "Add Customer" },
        { name: "description", content: "Add Your Customer Here" },
    ];
};

export const action: ActionFunction = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    try {
        const validatedData = customerSchema.parse(Object.fromEntries(formData));
        const { data } = await addCustomer(validatedData);
        return redirect('/dashboard/customerslist')
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.flatten().fieldErrors;
            return json({ success: false, errors }, { status: 400 });
        }
    }
}

export default function AddCustomers() {
    const result = useActionData<typeof action>();
    const [toggle, setToggle] = useState(true)
    const navigate = useNavigate();
    const handleClose = () => {
        setToggle(false)
    }
    return (
        <Dialog open={toggle} onOpenChange={handleClose}>
            <DialogContent onCloseAutoFocus={() => navigate('/dashboard/customerslist')}>
                <DialogHeader>
                    <DialogTitle>Add New Customer</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you are done.
                    </DialogDescription>
                </DialogHeader>
                <div className="my-16 w-full gap-5 mx-auto mr-5 flex flex-col">
                    <Form className="flex justify-center flex-col gap-3 w-full" method="post">
                        <Input type="text" name="name" id="name" placeholder="Enter  Name" />
                        {result?.errors?.name && (
                            <p className="text-red-500 text-xs">
                                {result.errors.name}
                            </p>
                        )}
                        <Input type="text" name="email" id="email" placeholder="Enter Email" />
                        {result?.errors?.email && (
                            <p className="text-red-500 text-xs">
                                {result.errors.email}
                            </p>
                        )}
                        <Input type="tel" name="phone" id="phone" placeholder="Enter Phone Number" />
                        {result?.errors?.phone && (
                            <p className="text-red-500 text-xs">
                                {result.errors.phone}
                            </p>
                        )}
                        <Input type="text" name="address" id="address" placeholder="Enter Address" />
                        {result?.errors?.address && (
                            <p className="text-red-500 text-xs">
                                {result.errors.address}
                            </p>
                        )}
                        <Button type="submit">Add Customer</Button>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
