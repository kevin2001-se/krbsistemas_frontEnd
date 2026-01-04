import api from "@/config/axios"
import type { IBanner, TableType } from "@/models/admin.type"
import { isAxiosError } from "axios"

export const getBannerPaginate = async (page: number = 1, limit: number = 2, search:  string = "") => {
    try {
        
        const { data } = await api.get<TableType<IBanner>>(`/banner/paginate?page=${page}&limit=${limit}&search=${search}`)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const createBanner = async (formData: FormData) => {
    try {
        
        const { data } = await api.post<string>(`/banner`, formData)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const getBannerById = async (_id: string) => {
    try {
        
        const { data } = await api.get<IBanner>(`/banner/${_id}`)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const updatedBanner = async ({_id, formData}: {_id: string, formData: FormData}) => {
    try {
        
        const { data } = await api.put<string>(`/banner/${_id}`, formData)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const deleteBannerById = async (_id: string) => {
    try {
        
        const { data } = await api.delete<string>(`/banner/${_id}`)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}