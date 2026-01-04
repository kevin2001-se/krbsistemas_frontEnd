import api from "../config/axios"
import type { Products } from "../models";

export const getProductos = async () => {
    try {
        const { data } = await api.get<Products[]>("/producto")

        return data;
    } catch (error) {
        console.log(error)
    }
}