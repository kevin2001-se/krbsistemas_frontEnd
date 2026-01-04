import api from "@/config/axios"
import type { IProduct, TableType } from "@/models/admin.type"
import { isAxiosError } from "axios"

export const getProductPaginate = async (page: number = 1, limit: number = 2, search:  string = "") => {
    try {
        
        const { data } = await api.get<TableType<IProduct>>(`/producto/paginate?page=${page}&limit=${limit}&search=${search}`)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const createProduct = async (formData: FormData) => {
    try {
        
        const { data } = await api.post<string>(`/producto`, formData)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const getProductById = async (_id: string) => {
    try {
        
        const { data } = await api.get<IProduct>(`/producto/${_id}`)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const updatedProduct = async ({_id, formData}: {_id: string, formData: FormData}) => {
    try {
        
        const { data } = await api.put<string>(`/producto/${_id}`, formData)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const deleteProductById = async (_id: string) => {
    try {
        
        const { data } = await api.delete<string>(`/producto/${_id}`)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}