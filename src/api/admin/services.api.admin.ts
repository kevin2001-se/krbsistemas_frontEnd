import api from "@/config/axios"
import type { IService, TableType } from "@/models/admin.type"
import { isAxiosError } from "axios"

export const getServicePaginate = async (page: number = 1, limit: number = 2, search:  string = "") => {
    try {
        
        const { data } = await api.get<TableType<IService>>(`/service/paginate?page=${page}&limit=${limit}&search=${search}`)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const createService = async (formData: FormData) => {
    try {
        
        const { data } = await api.post<string>(`/service`, formData)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const getServiceById = async (_id: string) => {
    try {
        
        const { data } = await api.get<IService>(`/service/${_id}`)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const updatedService = async ({_id, formData}: {_id: string, formData: FormData}) => {
    try {
        
        const { data } = await api.put<string>(`/service/${_id}`, formData)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const deleteServiceById = async (_id: string) => {
    try {
        
        const { data } = await api.delete<string>(`/service/${_id}`)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}