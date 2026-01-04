import Banner from "../components/Banner";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import Productos from "../components/Productos";
import Servicio from "../components/Servicio";
import { Element } from 'react-scroll';

export default function Home() {
    return (
        <>
            <NavBar />

            <Element name="inicio">
                <Banner />
            </Element>
            
            <Element name="productos">
                <Productos />
            </Element> 

            <Element name="servicios">
                <Servicio />
            </Element>

            <Footer />
        </>
    )
}
