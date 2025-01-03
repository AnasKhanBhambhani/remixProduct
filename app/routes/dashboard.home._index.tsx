import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { AppWindowMac, CircleDollarSign, Weight } from "lucide-react"
import { ProfitChart } from "../components/ProfitChart";
import { fetchProducts } from "~/Apis/product";
import { useLoaderData } from "@remix-run/react";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};
export const loader:LoaderFunction = async()=>{
const data = await fetchProducts();
return json(data);
}

export default function Dashboard() {
    const {data} = useLoaderData<typeof loader>();
    return (
        <div className=" my-16 w-full h-full max-w-[1500px] mx-auto mr-5 bg-white">
            <div className="flex justify-between  items-center ">
                <div className=" flex w-full max-w-sm items-center space-x-2">
                    <Input type="email" placeholder="Search Products" />
                    <Button type="submit">Search</Button>
                </div>
                <div>
                    <h1 className="text-3xl">Product Management System</h1>
                </div>
            </div>
            <div className=" flex gap-10 my-10  justify-between">
                <Card className="flex p-12 gap-3   w-72 ">
                    <div className=" flex items-center">
                        <AppWindowMac className="size-10 text-black" />
                    </div>
                    <div className="flex flex-col">
                        <p>Total Products</p>
                        <h1 className="text-3xl">{data?.length || 0}</h1>
                    </div>
                </Card>
                <Card className="flex p-12 gap-3  w-72">
                    <div className=" flex items-center">
                        <Weight className="size-10 text-black" />
                    </div>
                    <div className="flex flex-col">
                        <p>Saled Products</p>
                        <h1 className="text-3xl">400</h1>
                    </div>
                </Card>
                <Card className="flex p-12 gap-3  w-72">
                    <div className=" flex items-center">
                    <CircleDollarSign className="size-10 text-black" />
                    </div>
                    <div className="flex flex-col">
                        <p>Total Profit</p>
                        <h1 className="text-3xl">200$</h1>
                    </div>
                </Card>
                <Card className="flex p-12 gap-3  w-72">
                    <div className=" flex items-center">
                    <CircleDollarSign className="size-10 text-black" />
                    </div>
                    <div className="flex flex-col">
                        <p>Categories</p>
                        <h1 className="text-3xl">10</h1>
                    </div>
                </Card>
              
            </div>
            <div className="">
                <ProfitChart/>
               </div>
        </div>
    );
}
