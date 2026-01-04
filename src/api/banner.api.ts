import api from "../config/axios"
import type { Banner } from "../models";

export const getObtenerBanner = async () => {
    try {
        
        const { data } = await api.get<Banner[]>('/banner');

        return data;
    } catch (error) {
        console.log(error)
    }
}