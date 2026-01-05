import ButtonWeb from "./ui/ButtonWeb";
import { motion } from "motion/react"
import { getObtenerBanner } from "../api/banner.api";
import { useEffect, useState } from "react";
import type { Banner } from "../models";
import SkeletonBanner from "./skeleton/SkeletonBanner";

export default function Banner() {

    const [banner, setBanner] = useState<Banner | null>(null)
    const [pending, setPending] = useState(false)

    const obtenerBanner = async () => {
        setPending(true);
        const data = await getObtenerBanner();
        setBanner(data && data.length === 0 ? null : data![0]);
        setPending(false);
    }

   useEffect(() => {
        obtenerBanner();
   }, [])

   if (pending) return (
        <SkeletonBanner />
   )

    if(banner && !pending) return (
        <div className={`mb-[77px]`} style={{ backgroundColor: banner.background }}>
            <div className="w-10/12 lg:w-[82%] m-auto flex justify-between py-5">
                <div className="grid grid-cols-2 lg:h-[542px]">
                    <motion.div   initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col justify-center gap-4">
                        <h1 className="font-bold text-6xl leading-[70px]">{banner.title}</h1>
                        <p className="text-[#686662] text-base lg:w-[500px]">{banner.description}</p>
                        <ButtonWeb name="Solicitar demo por WhatsApp" />
                    </motion.div>
                    <div className="flex justify-center">
                        <motion.img src={banner.image} alt="Banner Sistema Pos" className="lg:max-w-[526px] " 
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
