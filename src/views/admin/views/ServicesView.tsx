import { getServicePaginate } from "@/api/admin/services.api.admin";
import DataTable from "@/components/DataTable";
import DialogServiceCreate from "@/components/dialog/DialogServiceCreate";
import DialogServiceDelete from "@/components/dialog/DialogServiceDelete";
import DialogServiceEdit from "@/components/dialog/DialogServiceEdit";
import type { IService, TableColumnType } from "@/models/admin.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function ServicesView() {

    const [service, setService] = useState<IService | null>(null)
    const [ searchParams, setSearchParams ] = useSearchParams();
    const searchQuery = searchParams.get('search') ?? ""
    const page = searchParams.get('page') ?? 1
    const limit = 10;

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["service", page, searchQuery],
        queryFn: () => getServicePaginate(+page, limit, searchQuery),
        retry: 2
    })

    const onSearchProduct = (search: string) => {
        setSearchParams({ search: search })
        queryClient.invalidateQueries({ queryKey: ["user", page, searchQuery] })
    }

    const resetSearch = () => {
        setSearchParams({ search: '' })
        queryClient.invalidateQueries({ queryKey: ["user", page, searchQuery] })
    }
    
    const onEditService = (data: IService) => {
        setSearchParams({ modal: 'modalEdit' })
        setService(data)
    }

    const onDeleteService = (data: IService) => {
        setSearchParams({ modal: 'modalDelete' })
        setService(data)
    }

    const onCreateService = () => {
        setSearchParams({ modal: 'modalCreate' })
    }

    if (+page > 1 && data?.data.length == 0) {
        setSearchParams({ page: '1' })
    }

    const configColumn: TableColumnType[] = [
        { name: '#', column: "_id", type: 'string' },
        { name: 'Titulo', column: "title", type: 'string' },
        { name: 'Descripción', column: "description", type: 'string' },
        { name: 'Precio', column: "price", type: 'price' },
        { name: 'Imagen', column: "image", type: 'image' },
        { name: 'Fecha Creación', column: "createdAt", type: 'date' },
        { name: 'Acción', column: "", type: 'button' },
    ]

    return (
        <>
            <h1 className="text-xl font-bold">Servicios</h1>

            {
                <DataTable 
                    data={data} 
                    page={page.toString()} 
                    resetSearch={resetSearch} 
                    onSearchProduct={onSearchProduct} 
                    configColumn={configColumn} 
                    isLoading={isLoading} 
                    onCreateRow={onCreateService}
                    onEditRow={onEditService}
                    onDeleteRow={onDeleteService}
                    isCreate={true}
                /> 
            }
            
            {service && <DialogServiceEdit service={service} setService={setService} />}

            {service && <DialogServiceDelete service={service} setService={setService} /> }
            
            <DialogServiceCreate />
            
        </>
    )
}
