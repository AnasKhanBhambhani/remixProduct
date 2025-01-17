import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
    return [
        { title: "New Remix App" },
        { name: "description", content: "Welcome to Remix!" },
    ];
};

// export const loader = async({request}:LoaderFunctionArgs)=>{

// }

export default function Product() {

    return (
        <>
            <h1>anas</h1>
        </>
    );
}
