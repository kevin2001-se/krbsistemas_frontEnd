import { getBannerPaginate } from "@/api/admin/banner.api.admin";
import DataTable from "@/components/DataTable";
import DialogBannerEdit from "@/components/dialog/DialogBannerEdit";
import type { IBanner, TableColumnType } from "@/models/admin.type";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function BannerView() {

    const [ searchParams, setSearchParams ] = useSearchParams();
    const [banner, setBanner] = useState<IBanner | null>(null)
    const searchQuery = searchParams.get('search') ?? ""
    const page = searchParams.get('page') ?? 1
    const limit = 10;

    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ["banner", page, searchQuery],
        queryFn: () => getBannerPaginate(+page, limit, searchQuery),
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

    const onEditBanner = (banner: IBanner) => {
        setSearchParams({ modal: 'modalEdit' })
        setBanner(banner)
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
        { name: 'Color Fondo', column: "background", type: 'string' },
        { name: 'Acción', column: "", type: 'button' },
    ]

    return (
        <>
            <h1 className="text-xl font-bold">Banner</h1>

            {
                <DataTable 
                    data={data} 
                    page={page.toString()} 
                    resetSearch={resetSearch} 
                    onSearchProduct={onSearchProduct} 
                    configColumn={configColumn} 
                    isLoading={isLoading} 
                    isNotDelete={true}
                    onEditRow={onEditBanner}
                /> 
            }

            { banner && <DialogBannerEdit banner={banner} setBanner={setBanner} /> }
            
        </>
    )
}
