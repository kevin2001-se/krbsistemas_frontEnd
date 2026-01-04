import { Link } from "react-scroll";

export default function NavBar() {
    return (
        <nav className="border-b border-[#E2E2E2] col-span-12 sticky top-0 bg-white">
            <div className="w-10/12 lg:w-[82%] m-auto flex justify-between py-5">
                
                <Link to="inicio" offset={-80} smooth={true}  duration={500} className="font-black text-3xl cursor-pointer">KRBSistemas</Link>
                
                <ul className="flex gap-8 items-center">
                    <li>
                        <Link to="inicio" offset={-80} smooth={true} duration={500} className="hover:underline cursor-pointer">Inicio</Link>
                    </li>
                    <li>
                        <Link to="productos" smooth={true} duration={500} className="hover:underline cursor-pointer">Productos</Link>
                    </li>
                    <li>
                        <Link to="servicios" smooth={true} duration={500} className="hover:underline cursor-pointer">Servicios</Link>
                    </li>
                    <li>
                        <a href="https://wa.me/54941165733?text=Hola! Quiero más información" target="_blank" className="bg-primary text-white p-3 rounded-md cursor-pointer">Contactame</a>
                    </li>
                </ul>

            </div>
        </nav>
    )
}
