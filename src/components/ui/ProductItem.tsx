import type { Products } from "../../models";
import ButtonWeb from "./ButtonWeb";
import { motion } from "motion/react"

type ProductItemProps = {
    product: Products
}

export default function ProductItem({product}: ProductItemProps) {

    const handleButtonAccion = () => {
        console.log('Hola')
    }

    return (
        <motion.aside className="xl:w-[388px] space-y-2"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
        >
            <div className="bg-[#F6F6F6] p-5 rounded-lg">
                <img src={product.image} alt="Producto 3" className="max-w-[250px] mx-auto" />
            </div>
            <p className="font-semibold text-base">{product.description}</p>
            <span className="block font-extrabold">S/. {product.price}</span>
            <ButtonWeb name="Consultar por WhatsApp" handleButtonAccion={handleButtonAccion} />
        </motion.aside>
    )
}
