import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { AppWindowMac, CircleDollarSign, Weight } from "lucide-react"
import { fetchProducts } from "~/apis/product";
import { useLoaderData, useOutletContext } from "@remix-run/react";
import { fetchCategoriesList } from "~/apis/categories";
import { ProfitChart } from "~/components/ProfitChart";

export const meta: MetaFunction = () => {
    return [
        { title: "Dashboard | product management system" },
        { name: "description", content: "Here is the Dashboard of the product management system" },
    ];
};

export const loader: LoaderFunction = async () => {
    const { allProducts } = await fetchProducts();
    const category = await fetchCategoriesList();
    return json({ allProducts, category });
}

export default function Dashboard() {
    const user: String = useOutletContext();
    const { allProducts, category } = useLoaderData<typeof loader>();
    return (
        <div className="py-20 h-full max-w-[1500px] mx-auto">
            <div className="flex justify-between  items-center ">
                <div className=" flex w-full max-w-sm items-center space-x-2">
                    <Input type="email" placeholder="Search Products" />
                    <Button type="submit">Search</Button>
                </div>
                <div>
                    <h1 className="text-3xl">Welcome {user ?? user}</h1>
                </div>
            </div>
            <div className=" flex gap-10 my-10  justify-evenly">
                <Card className="flex  py-6  gap-3 justify-evenly  w-72 cursor-pointer hover:shadow-lg">
                    <div className=" flex items-center bg-green-200 p-3 rounded-full">
                        <AppWindowMac className="size-10 text-black" />
                    </div>
                    <div className="flex flex-col">
                        <p>Total Products</p>
                        <h1 className="text-3xl">{allProducts?.length || 0}</h1>
                    </div>
                </Card>
                <Card className="flex  py-6  gap-3 justify-evenly  w-72 cursor-pointer hover:shadow-lg">
                    <div className=" flex items-center p-3 rounded-full bg-cyan-200">
                        <CircleDollarSign className="size-10 text-black" />
                    </div>
                    <div className="flex flex-col">
                        <p>Categories</p>
                        <h1 className="text-3xl">{category.categories?.length || 0}</h1>
                    </div>
                </Card>
                <Card className="flex  py-6  gap-3 justify-evenly  w-72 cursor-pointer hover:shadow-lg">

                    <div className=" flex items-center bg-orange-200 p-3 rounded-full">
                        <Weight className="size-10 text-black" />
                    </div>
                    <div className="flex flex-col">
                        <p>Saled Products</p>
                        <h1 className="text-3xl">400</h1>
                    </div>
                </Card>
                <Card className="flex  py-6  gap-3 justify-evenly  w-72 cursor-pointer hover:shadow-lg">

                    <div className=" flex items-center p-3 rounded-full bg-blue-200">
                        <CircleDollarSign className="size-10 text-black" />
                    </div>
                    <div className="flex flex-col">
                        <p>Total Profit</p>
                        <h1 className="text-3xl">200$</h1>
                    </div>
                </Card>
            </div>
            <div className="">
                <ProfitChart />
            </div>
        </div>
    );
}
