import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useSwiper } from "swiper/react"

export default function SwiperNavigationWeb() {

    const swiper = useSwiper();

    return (
        <div className="w-full absolute flex justify-between z-50  top-2/4 -translate-y-2/4">
            <button type="button" className="cursor-pointer" onClick={() => swiper.slidePrev()}>
                <HiChevronLeft size={35} />
            </button>
            <button type="button" className="cursor-pointer" onClick={() => swiper.slideNext()}>
                <HiChevronRight size={35} />
            </button>
        </div>
    )
}
