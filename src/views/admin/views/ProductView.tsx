import { getProductPaginate } from "@/api/admin/product.api.admin"
import DataTable from "@/components/DataTable"
import DialogProductCreate from "@/components/dialog/DialogProductCreate"
import DialogProductDelete from "@/components/dialog/DialogProductDelete"
import DialogProductEdit from "@/components/dialog/DialogProductEdit"
import type { IProduct, TableColumnType } from "@/models/admin.type"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

export default function ProductView() {

    const [product, setProduct] = useState<IProduct | null>(null)
    const [ searchParams, setSearchParams ] = useSearchParams();
    const searchQuery = searchParams.get('search') ?? ""
    const page = searchParams.get('page') ?? 1
    const limit = 10;

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["product", page, searchQuery],
        queryFn: () => getProductPaginate(+page, limit, searchQuery),
        retry: 2
    })

    const onSearchProduct = (search: string) => {
        setSearchParams({ search: search })
        queryClient.invalidateQueries({ queryKey: ["product", page, searchQuery] })
    }

    const resetSearch = () => {
        setSearchParams({ search: '' })
        queryClient.invalidateQueries({ queryKey: ["product", page, searchQuery] })
    }

    const onEditProduct = (data: IProduct) => {
        setSearchParams({ modal: 'modalEdit' })
        setProduct(data)
    }

    const onDeleteProduct = (data: IProduct) => {
        setSearchParams({ modal: 'modalDelete' })
        setProduct(data)
    }

    const onCreateProduct = () => {
        setSearchParams({ modal: 'modalCreate' })
    }

    if (+page > 1 && data?.data.length == 0) {
        setSearchParams({ page: '1' })
    }

    const configColumn: TableColumnType[] = [
        { name: '#', column: "_id", type: 'string' },
        { name: 'Descripción', column: "description", type: 'string' },
        { name: 'Precio', column: "price", type: 'price' },
        { name: 'Stock', column: "stock", type: 'string' },
        { name: 'Imagen', column: "image", type: 'image' },
        { name: 'Fecha Creación', column: "createdAt", type: 'date' },
        { name: 'Acción', column: "", type: 'button' },
    ]

    return (
        <>
            <h1 className="text-xl font-bold">Productos</h1>

            {
                <DataTable 
                    data={data} 
                    page={page.toString()} 
                    resetSearch={resetSearch} 
                    onSearchProduct={onSearchProduct} 
                    configColumn={configColumn} 
                    isLoading={isLoading} 
                    onEditRow={onEditProduct}
                    onDeleteRow={onDeleteProduct}
                    isCreate={true}
                    onCreateRow={onCreateProduct}
                /> 
            }

            {product && <DialogProductEdit product={product} setProduct={setProduct} />}

            {product && <DialogProductDelete product={product} setProduct={setProduct} /> }
            
            <DialogProductCreate />
        </>
    )
}
