type Input = {
    id: string,
    name: string,
    type: string,
    message?: string,
    label?: string,
    placeholder?: string,
    accept?: string,
    required?: boolean,
}
const Inputs = ({ id, name, type, message, label, placeholder, accept, required }: Input) => {
    return (
        <>
            <label
                className="font-semibold text-sm text-gray-600 pb-1 block"
                htmlFor="login"
            >{label && label}</label>
            <input
                className="border bg-white rounded-lg px-3 py-2 mt-1 text-sm w-full"
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                accept={accept}
                required={required}
            />
            <div className="text-red-500 text-xs mb-5"> {message || ''}</div>
        </>
    )

}
export default Inputs