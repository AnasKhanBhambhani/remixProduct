import { MetaFunction } from '@remix-run/node'


export const meta: MetaFunction = () => {
    return [
        { title: "Login | Product management system" },
        { name: "description", content: "Login to access the product management system" },
    ];
};



export default function Categories() {
    return (
        <div className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% w-full flex min-h-svh flex-col  items-center justify-center bg-muted p-6 md:p-10">
            ssss
        </div>
    )
}
