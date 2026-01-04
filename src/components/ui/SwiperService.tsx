// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
// import required modules
import { Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import SwiperNavigationWeb from './SwiperNavigationWeb';
import ButtonWeb from './ButtonWeb';
import type { Services } from '../../models';

type SwiperServiceProps = {
    services: Services[];
}

export default function SwiperService({services}: SwiperServiceProps) {
    return (
        <Swiper
            slidesPerView={1}
            spaceBetween={30}
            loop={true}
            modules={[Pagination, Navigation]}
            className="h-[537px] border-[2px] border-primary rounded-2xl"
        >
            {
                services.map(service => (
                    <SwiperSlide key={service._id}>
                        <div className='h-full lg:w-10/12 mx-auto'>
                            <div className='h-full grid grid-cols-2'>
                                <div className='flex flex-col justify-center gap-4'>
                                    <h1 className='font-semibold text-[40px] max-w-96 leading-[48px]'>{service.title}</h1>
                                    <p className='text-sm leading-7 max-w-[500px]'>{service.description}</p>
                                    <ButtonWeb name="Consultar por WhatsApp" />
                                </div>
                                <div className='flex items-center justify-center'>
                                    <img src={service.image} alt='Soporte tecnico' className='w-full lg:w-[545px]' />
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))
            }
            <SwiperNavigationWeb />
        </Swiper>
    )
}
