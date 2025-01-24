import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "../components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../components/ui/popover"
import { CategoryName } from "~/types/categories"
import { Input } from "./ui/input"



const ComboboxDemo: React.FC<CategoryName> = ({ categories }) => {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [id, setId] = React.useState("")
    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className=" w-full justify-between"
                    >
                        {value
                            ? categories.find((item) => item.category === value)?.category
                            : "Select Category..."}
                        <ChevronsUpDown className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search Category..." />
                        <CommandList className="max-h-[300px] overflow-y-auto scrollbar-hover">
                            <CommandEmpty>No Category found.</CommandEmpty>
                            <CommandGroup >
                                {categories.map((item) => (
                                    <CommandItem
                                        key={item.id}
                                        value={item.category}
                                        onSelect={(currentValue) => {
                                            setValue(currentValue === value ? "" : currentValue)
                                            setId(item.id)
                                            setOpen(false)
                                        }}
                                    >
                                        {item.category}
                                        <Check
                                            className={cn(
                                                "ml-auto",
                                                value === item.category ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <input type="hidden" name={'category'} value={id} />
        </>
    )
}

export default ComboboxDemo;