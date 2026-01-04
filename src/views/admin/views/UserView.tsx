import { getUserPaginate } from "@/api/admin/user.admin";
import DataTable from "@/components/DataTable";
import DialogUserCreate from "@/components/dialog/DialogUserCreate";
import DialogUserDelete from "@/components/dialog/DialogUserDelete";
import DialogUserEdit from "@/components/dialog/DialogUserEdit";
import type { IUser, TableColumnType } from "@/models/admin.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function UserView() {

    const [ searchParams, setSearchParams ] = useSearchParams();
    const [user, setUser] = useState<IUser | null>(null)
    const searchQuery = searchParams.get('search') ?? ""
    const page = searchParams.get('page') ?? 1
    const limit = 10;

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["user", page, searchQuery],
        queryFn: () => getUserPaginate(+page, limit, searchQuery),
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
        
    const onEditUser = (data: IUser) => {
        setSearchParams({ modal: 'modalEdit' })
        setUser(data)
    }

    const onDeleteUser = (data: IUser) => {
        setSearchParams({ modal: 'modalDelete' })
        setUser(data)
    }

    const onCreateUser = () => {
        setSearchParams({ modal: 'modalCreate' })
    }

    if (+page > 1 && data?.data.length == 0) {
        setSearchParams({ page: '1' })
    }

    const configColumn: TableColumnType[] = [
        { name: '#', column: "_id", type: 'string' },
        { name: 'Usuario', column: "username", type: 'string' },
        { name: 'Email', column: "email", type: 'string' },
        { name: 'Estado', column: "isActive", type: 'activo' },
        { name: 'Fecha Creación', column: "createdAt", type: 'date' },
        { name: 'Acción', column: "", type: 'button' },
    ]

    return (
        <>
            <h1 className="text-xl font-bold">Usuarios</h1>

            {
                <DataTable 
                    data={data} 
                    page={page.toString()} 
                    resetSearch={resetSearch} 
                    onSearchProduct={onSearchProduct} 
                    configColumn={configColumn} 
                    isLoading={isLoading} 
                    onCreateRow={onCreateUser}
                    onEditRow={onEditUser}
                    onDeleteRow={onDeleteUser}
                    isCreate={true}
                /> 
            }
                        
            {user && <DialogUserEdit user={user} setUser={setUser} />}

            {user && <DialogUserDelete user={user} setUser={setUser} /> }
            
            <DialogUserCreate />
            
        </>
    )
}
