import { Children } from "react"

type Button = {
    label: string,
    name: string,
    value: string,

}
const Button = ({ label, name, value }: Button) => {
    return (
        <button
            className="py-2 px-4 bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            type='submit'
            name={name}
            value={value}
        >
            {label}
        </button>
    )

}
export default Button