import { ActionFunction, ActionFunctionArgs, json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { Card } from "../components/ui/card";
import { deleteProduct, fetchProducts } from "~/Apis/product";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { Products } from "~/types/product";
import { Button } from "../components/ui/button";
import { requireUserSession } from "~/session.server";
import { Input } from "~/components/ui/input";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

export const loader: LoaderFunction = async ({ request }) => {
    const data = await fetchProducts();
    const logStatus = await requireUserSession(request);
    const newData = {
        data: [...data],
        status: logStatus,
    };
    return json(newData);
};

export const action: ActionFunction= async({request}:ActionFunctionArgs)=>{
const formData = await request.formData();
const id = formData.get('id');
deleteProduct(id)
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
            <h1 className=" text-center text-3xl my-10">Your Products</h1>
            <div className="flex flex-wrap  p-1 gap-7 justify-center">
                {data?.data.map((item: Products) => (
                    <Card key={item.id} className="bg-slate-100 text-center p-3  flex flex-col justify-between">
                        <div className=" flex justify-center rounded-lg  max-h-52">
                            <img
                                src={item.ProductImage}
                                alt="banner"
                                width='200px'
                                height='200px'
                                className="rounded-lg"
                            />
                        </div>
                        <div className="p-10 w-64  max-h-40 overflow-y-auto scrollbar-hide">
                            <div className="col-span-2 text-lg font-bold capitalize rounded-md">
                                Name: {item.name}
                            </div>
                            <div className="col-span-2 rounded-md">
                                Description: {item.description}
                            </div>
                            <div className="col-span-2 rounded-md">Price: {item.price}</div>
                        </div>
                        {data?.status === "admin" && (
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
                                    <Input type="hidden"  id="id" name="id" value={String(item.id)}/>
                                </Form>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
}
