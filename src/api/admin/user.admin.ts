import api from "@/config/axios"
import type { IUserChangePassword, IUserFormCreate, IUserFormEdit, IUserPaginate, TableType } from "@/models/admin.type"
import { isAxiosError } from "axios"

export const getUserPaginate = async (page: number = 1, limit: number = 2, search:  string = "") => {
    try {
        
        const { data } = await api.get<TableType<IUserPaginate>>(`/user?page=${page}&limit=${limit}&search=${search}`)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const createUser = async (formData: IUserFormCreate) => {
    try {
        
        const { data } = await api.post<string>(`/user`, formData)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const getUserById = async (_id: string) => {
    try {
        
        const { data } = await api.get<IUserPaginate>(`/user/${_id}`)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const updatedUser = async ({_id, formData}:{_id: string, formData: IUserFormEdit}) => {
    try {
        
        const { data } = await api.put<string>(`/user/${_id}`, formData)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const deleteUserById = async (_id: string) => {
    try {
        
        const { data } = await api.delete<string>(`/user/${_id}`)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const changePassword = async (formData: IUserChangePassword) => {
    try {
        
        const { data } = await api.put<string>(`/user/changePassword`, formData)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}