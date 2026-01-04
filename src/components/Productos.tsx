import { useEffect, useState } from "react";
import { getProductos } from "../api/product.api";
import ProductItem from "./ui/ProductItem";
import type { Products } from "../models";


export default function Productos() {

    const [products, setProducts] = useState<Products[]>([])

    useEffect(() => {
        obtenerProducto();
    }, [])

    const obtenerProducto = async () => {
        const productos = await getProductos();
        if (productos) {
            setProducts(productos)
        }
    }

    return (
        <div className="mb-[77px]">
            <div className="w-10/12 lg:w-[82%] m-auto">
                <section className="flex flex-wrap justify-between gap-x-5 gap-y-10">
                    {
                        products.map(product => (
                            <ProductItem key={product._id} product={product} />
                        ))
                    }
                </section>
            </div>
        </div>
    )
}
