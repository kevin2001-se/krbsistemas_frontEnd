import { useEffect, useState } from "react";
import type { Services } from "../models";
import SwiperService from "./ui/SwiperService";
import { motion } from "motion/react"
import { getObtenerServicio } from "../api/service.api";
import SkeletonHome from "./skeleton/SkeletonHome";

export default function Servicio() {

    const [services, setServices] = useState<Services[]>([])
    const [pending, setPending] = useState(false)

    useEffect(() => {
        obtenerServices();
    }, [])

    const obtenerServices = async () => {
        setPending(true)
        const productos = await getObtenerServicio();
        if (productos) {
            setServices(productos)
            setPending(false)
        }
    }

    if (pending) return (
        <SkeletonHome />
    )
    return (
        <motion.div className="mb-[77px]" 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}>
            <div className="w-10/12 lg:w-[82%] m-auto">
                <SwiperService services={services} />
            </div>
        </motion.div>
    )
}
