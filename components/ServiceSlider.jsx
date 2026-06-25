import {
  RxArrowTopRight,
} from "react-icons/rx";
import { FreeMode, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import useSWR from "swr";
import * as RxIcons from "react-icons/rx";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";

import { serviceData } from "../data/serviceData";

const ServiceSlider = () => {
  const { data: dbServices } = useSWR('/api/content/services');

  const services = dbServices || serviceData;

  return (
    <Swiper
      breakpoints={{
        320: {
          slidesPerView: 1,
          spaceBetween: 15,
        },
        640: {
          slidesPerView: 3,
          spaceBetween: 15,
        },
      }}
      pagination={{
        clickable: true,
      }}
      modules={[FreeMode, Pagination]}
      freeMode
      className="h-[240px] sm:h-[340px]"
    >
      {services.map((item, i) => {
        const rawIcon = item.icon || item.Icon;
        const IconComponent = typeof rawIcon === 'string' ? RxIcons[rawIcon] : rawIcon;

        return (
          <SwiperSlide key={i}>
            <div className="bg-[rgba(65,47,123,0.15)] h-max rounded-lg px-6 py-8 flex sm:flex-col gap-x-6 sm:gap-x-0 group cursor-pointer hover:bg-[rgba(89,65,169,0.15)] transition-all duration-300">
              {/* icon */}
              <div className="text-4xl text-accent mb-4">
                {IconComponent && <IconComponent aria-hidden />}
              </div>

              {/* title & description */}
              <div className="mb-8">
                <div className="mb-2 text-lg">{item.title}</div>
                <p className="max-w-[350px] leading-normal">{item.description}</p>
              </div>

              {/* arrow */}
              <div className="text-3xl">
                <RxArrowTopRight
                  className="group-hover:rotate-45 group-hover:text-accent transition-all duration-300"
                  aria-hidden
                />
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default ServiceSlider;
