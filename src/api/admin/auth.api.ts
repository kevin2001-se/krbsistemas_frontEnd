import api from "@/config/axios";
import type { IUser, LoginForm } from "@/models/admin.type";
import { isAxiosError } from "axios";

export const login = async (formData: LoginForm) => {
    try {
        
        const { data } = await api.post<string>('/user/login', formData)

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}

export const getUser = async () => {
    try {
        
        const { data } = await api.get<IUser>('/user/auth')

        return data
    } catch (error) {
        if (isAxiosError(error) && error.isAxiosError) {
            throw new Error(error.response?.data.error)
        }
    }
}