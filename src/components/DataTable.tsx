import { formatDate } from "@/helpers/dateFormat";
import { formatPrecio } from "@/helpers/priceFormat";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Edit, Search, Trash, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import type { TableColumnType, TableType } from "@/models/admin.type";
import { cn } from "@/lib/utils";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Spinner } from "./ui/spinner";

type DataTableProps = {
    data?: TableType<any>;
    configColumn: TableColumnType[];
    page: string;
    isLoading: boolean;
    isCreate?: boolean;
    isNotDelete?: boolean;
    onSearchProduct: (search: string) => void;
    resetSearch: () => void;
    onEditRow?: (data: any) => void;
    onDeleteRow?: (data: any) => void;
    onCreateRow?: () => void;
}

export default function DataTable({data, configColumn, page, onSearchProduct, resetSearch, isLoading, onEditRow, onDeleteRow, isCreate, onCreateRow, isNotDelete}: DataTableProps) {

    const [ searchParams, setSearchParams ] = useSearchParams();
    const searchQuery = searchParams.get('search') ?? ""
    const [search, setSearch] = useState(searchQuery)

    const pagesArray = Array.from({ length: data ? data!.totalPages : 0 }, (_, i) => i + 1);
    
    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const handlePrevPage = () => {
        setSearchParams({ page: (+page - 1).toString() })
    }

    const handleNextPage = () => {
        setSearchParams({ page: (+page + 1).toString() })
    }

    const handleSubmitForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSearchProduct(search)
    }

    const handleResetForm = () => {
        setSearch("");
        resetSearch();
    }

    return (
        <>

            <form className="mt-4 flex justify-between items-center" onSubmit={handleSubmitForm}>
                <div className="flex items-end gap-3">
                    <div>
                        <Label htmlFor="search">Buscar</Label>
                        <Input type="text" className="w-72" placeholder="Buscar..." id="search" name="search" value={search}
                            onChange={handleSearch}
                        />
                    </div>
                    <div>
                        <Button type="submit">
                            <Search />
                        </Button>
                    </div>
                    {
                        search.length > 0 && (
                            <div>
                                <Button type="button" onClick={handleResetForm}>
                                    <X />
                                </Button>
                            </div>
                        )
                    }
                </div>
                {
                    isCreate && (
                        <div>
                            <Button type="button" onClick={onCreateRow}>Nuevo registro</Button>
                        </div>
                    )
                }
            </form>

            <div className="mt-4 shadow-lg rounded-lg overflow-hidden">
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="bg-gray-100 text-sm">
                            {
                                configColumn.map(column => (
                                    <th className="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase" key={column.column}>{column.name}</th>
                                ))
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !isLoading && data && data.data.length > 0 ? data.data.map(item => (
                                <tr className="text-sm" key={item._id}>
                                    {
                                        configColumn.map(column => (
                                            <td className="py-4 px-6 border-b border-gray-200" key={`${column.column}-${item._id}`}>
                                                {
                                                    column.type === 'string' ? 
                                                    item[column.column] : column.type === 'date' ? 
                                                    formatDate(item[column.column]) : column.type === 'price' ? 
                                                    formatPrecio(item[column.column]) : column.type === 'image' ? 
                                                    (<img className="h-16 w-16 shadow rounded-sm" src={item[column.column]} alt='Imagen administrador' />) : column.type === 'activo' ? (
                                                        <p>{item[column.column] == true ? 'Activo' : 'Inactivo'}</p>
                                                    )  : (
                                                        <div className="flex gap-2">
                                                            <Button onClick={() => onEditRow!(item)}>
                                                                <Edit />
                                                            </Button>
                                                            {
                                                                !isNotDelete && (
                                                                    <Button className="bg-red-600 hover:bg-red-800" onClick={() => onDeleteRow!(item)}>
                                                                        <Trash />
                                                                    </Button>
                                                                )
                                                            }
                                                            
                                                        </div>
                                                    ) 
                                                }
                                                
                                            </td>
                                        ))
                                    }
                                </tr>
                            )) : isLoading ? (
                                <tr>
                                    <td className="py-4 px-6 border-b border-gray-200" colSpan={configColumn.length}>
                                        <Spinner className="m-auto" />
                                    </td>
                                </tr>
                            ) : (
                                <tr>
                                    <td className="py-4 px-6 border-b border-gray-200 text-center" colSpan={configColumn.length}>
                                        No hay datos por mostrar.
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table>
                <div className="flex justify-center items-center mt-1-">
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button type="button" disabled={data && data.hasPrevPage == false} onClick={handlePrevPage}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
                            <span className="sr-only">Previous</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        {
                            pagesArray.map((item) => (
                                <Link to={`/admin/products?page=${item}`} key={item}
                                    className={
                                        cn({
                                            'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium': true,
                                            'bg-gray-700 text-white hover:hover:bg-gray-400': item == +page,
                                            'bg-white text-gray-700 hover:bg-gray-50': item != +page
                                        })
                                    }>
                                        {item}
                                </Link>
                            ))
                        }
                        <button type="button" disabled={data && data.hasNextPage == false} onClick={handleNextPage}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 cursor-pointer">
                            <span className="sr-only">Next</span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>

                    </nav>
                </div>
            </div>
        </>
    )
}
