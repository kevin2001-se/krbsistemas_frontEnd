import api from "../config/axios"
import type { Services } from "../models";

export const getObtenerServicio = async () => {
    try {
        
        const { data } = await api.get<Services[]>('/service');

        return data;
    } catch (error) {
        console.log(error)
    }
}