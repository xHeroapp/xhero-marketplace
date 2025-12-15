"use client";
import VideoPopup from "@/modals/VideoPopup";
import React, { useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const ProductSlider = ({ product_images }: { product_images: string }) => {
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false);

  return (
    <>
      <div className="product-slide-wrapper">
        <Swiper
          loop={true}
          autoplay={true}
          modules={[Autoplay]}
          className="product-slides owl-carousel"
        >
          {/* the products only have one image for now */}

          <SwiperSlide
            className="single-product-slide"
            style={{ backgroundImage: `${product_images}` }}
          ></SwiperSlide>
          <SwiperSlide
            className="single-product-slide"
            style={{ backgroundImage: `${product_images}` }}
          ></SwiperSlide>
          {/* <SwiperSlide className="single-product-slide" style={{ backgroundImage: `url(/assets/img/bg-img/11.jpg)` }}></SwiperSlide>
          <SwiperSlide className="single-product-slide" style={{ backgroundImage: `url(/assets/img/bg-img/6.jpg)` }}></SwiperSlide>
          <SwiperSlide className="single-product-slide" style={{ backgroundImage: `url(/assets/img/bg-img/10.jpg)` }}></SwiperSlide>
          <SwiperSlide className="single-product-slide" style={{ backgroundImage: `url(/assets/img/bg-img/11.jpg)` }}></SwiperSlide> */}
        </Swiper>

        <VideoPopup>
          <a
            className="video-btn shadow-sm"
            id="singleProductVideoBtn"
            href="https://www.youtube.com/watch?v=zE_WFiHnSlY"
            style={{ cursor: "pointer" }}
          >
            <i className="ti ti-player-play"></i>
          </a>
        </VideoPopup>
      </div>

      {/* video modal start */}
      {/* <VideoPopup
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId={"-hTVNidxg2s"}
      /> */}
      {/* video modal end  */}
    </>
  );
};

export default ProductSlider;
