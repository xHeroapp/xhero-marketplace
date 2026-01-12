"use client";
import React from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Swiper, SwiperSlide } from "swiper/react";
import { useGetFlashSale } from "@/queries/flashSales.queries";
import ImageWithFallback from "../reuseable/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";

const MyTimer = dynamic(() => import("../common/Timer"), { ssr: false });

const FlashSale = () => {
  const { data, isLoading, isError } = useGetFlashSale();

  // Calculate discount percentage
  const calculateDiscount = (normalPrice: string, flashPrice: string) => {
    const normal = parseFloat(normalPrice);
    const flash = parseFloat(flashPrice);
    return Math.round(((normal - flash) / normal) * 100);
  };

  // Get progress bar color based on discount
  const getProgressBarColor = (discount: number) => {
    if (discount >= 50) return "bg-danger";
    if (discount >= 30) return "bg-warning";
    return "bg-success";
  };

  // Get all flash sale products from the first page (for carousel display)
  const flashSaleProducts = data?.pages[0]?.flashSaleProduct || [];

  // If loading, show skeleton
  if (isLoading) {
    return (
      <div className="flash-sale-wrapper">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between rtl-flex-d-row-r">
            <h6 className="d-flex align-items-center rtl-flex-d-row-r">
              <i className="ti ti-bolt-lightning me-1 text-danger lni-flashing-effect"></i>
              Flash Sale
            </h6>
            <ul className="sales-end-timer ps-0 d-flex align-items-center rtl-flex-d-row-r">
              <MyTimer />
            </ul>
          </div>

          <Swiper
            loop={false}
            slidesPerView={3}
            spaceBetween={8}
            className="flash-sale-slide owl-carousel"
          >
            {[...Array(3)].map((_, i) => (
              <SwiperSlide key={i} className="card flash-sale-card">
                <div className="card-body">
                  {/* Image placeholder */}
                  <div
                    className="skeleton-box rounded mb-2"
                    style={{ width: "100%", height: "80px" }}
                  ></div>
                  {/* Title placeholder */}
                  <div
                    className="skeleton-box rounded mb-2"
                    style={{ width: "90%", height: "12px" }}
                  ></div>
                  {/* Price placeholder */}
                  <div
                    className="skeleton-box rounded mb-2"
                    style={{ width: "60%", height: "14px" }}
                  ></div>
                  {/* Progress placeholder */}
                  <div
                    className="skeleton-box rounded"
                    style={{ width: "100%", height: "6px" }}
                  ></div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <style jsx>{`
          .skeleton-box {
            background: linear-gradient(
              90deg,
              #f0f0f0 25%,
              #e0e0e0 50%,
              #f0f0f0 75%
            );
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite;
          }
          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}</style>
      </div>
    );
  }

  // If error or no products, don't render the component
  if (isError || flashSaleProducts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flash-sale-wrapper">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between rtl-flex-d-row-r">
            <h6 className="d-flex align-items-center rtl-flex-d-row-r">
              <i className="ti ti-bolt-lightning me-1 text-danger lni-flashing-effect"></i>
              Flash Sale
            </h6>

            <ul className="sales-end-timer ps-0 d-flex align-items-center rtl-flex-d-row-r">
              <MyTimer />
            </ul>

            {/* <div className="section-heading d-flex align-items-center justify-content-between dir-rtl"> */}
            <Link className="btn btn-sm btn-light" href="/flash-sale">
              View all<i className="ms-1 ti ti-arrow-right"></i>
            </Link>
            {/* </div> */}
          </div>

          <Swiper
            loop={flashSaleProducts.length > 3}
            slidesPerView={3}
            spaceBetween={5}
            className="flash-sale-slide owl-carousel"
          >
            {flashSaleProducts.map((item) => {
              const discount = calculateDiscount(
                item.normal_price,
                item.flash_price
              );
              const progressColor = getProgressBarColor(discount);

              return (
                <SwiperSlide
                  key={item.flash_sale_item_id}
                  className="card flash-sale-card"
                >
                  <div className="card-body">
                    <Link href={`/flash-sale-product/${item.product_id}`}>
                      <ImageWithFallback
                        src={item.image_url}
                        alt={item.product_name}
                      />
                      <span className="product-title">{item.product_name}</span>
                      <p className="sale-price">
                        {formatCurrency(item.flash_price)}
                        <span className="real-price">
                          {formatCurrency(item.normal_price)}
                        </span>
                      </p>
                      <span className="progress-title">{discount}% OFF</span>

                      <div className="progress">
                        <div
                          className={`progress-bar ${progressColor}`}
                          role="progressbar"
                          style={{ width: `${discount}%` }}
                          aria-valuenow={discount}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default FlashSale;
