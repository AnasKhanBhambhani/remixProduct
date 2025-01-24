import { Button } from "../ui/button"
import { Input } from "../ui/input"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    ColumnFiltersState,
    getFilteredRowModel,
    VisibilityState,
} from "@tanstack/react-table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table"
import React, { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "@remix-run/react"
import UseDebounce from "./useDebounce"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    filter: string;
    totalCount: number;
}

export function DataTable<TData, TValue>({ columns, data, filter, totalCount }: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [filtervalue, setFiltervalue] = useState('')
    let [searchParams, setSearchParams] = useSearchParams();
    const limit = Number(searchParams.get("limit") || "5");
    const page = Number(searchParams.get("page") || "0");
    const navigate = useNavigate();
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnFilters,
            columnVisibility,
        },
        manualPagination: true,
        manualFiltering: true,
    })

    const handlePagination = (newPage: number, newLimit: number) => {
        navigate(`?page=${newPage}&limit=${newLimit}`);
    }

    const handleFilter = (e: any) => {
        setFiltervalue(e.target.value)
    }

    const debounceData = UseDebounce(filtervalue)
    useEffect(() => {
        setSearchParams(prev => {
            const newParams = new URLSearchParams(prev);
            if (debounceData) {
                newParams.set("search", debounceData);
            } else {
                newParams.delete("search");
            }
            return newParams;
        });
    }, [debounceData, setSearchParams]);

    // useEffect(() => {
    //     setSearchParams(prev => {
    //         const newParams = new URLSearchParams(prev);
    //         if (debounceData) {
    //             newParams.set("search", debounceData);
    //             navigate(`?${newParams.toString()}`);
    //         } else {
    //             newParams.delete("search");
    //         }
    //         return newParams;
    //     });
    // }, [debounceData, setSearchParams]);

    return (
        <div className="bg-white rounded-md p-3 my-2">
            <div className="flex items-center py-4">
                <Input
                    placeholder={`Filter ${filter}...`}
                    value={filtervalue}
                    onChange={(e) => { handleFilter(e) }}
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter(
                                (column) => column.getCanHide()
                            )
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePagination(Number(page) - 1, Number(limit))}
                    disabled={Number(page) <= 0}>
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePagination(Number(page) + 1, Number(limit))}
                    disabled={Number(page + 1) * Number(limit) >= totalCount}>
                    Next
                </Button>
            </div>
        </div>
    )
}
