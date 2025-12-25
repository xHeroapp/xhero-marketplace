"use client";
import Footer from "@/layouts/Footer";
import HeaderThree from "@/layouts/HeaderThree";
import { useGetFlashSale } from "@/queries/flashSales.queries";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import ImageWithFallback from "./reuseable/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";

const FlashSale = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetFlashSale();

  const observerRef = useRef<HTMLDivElement>(null);

  // Infinite scroll observer
  useEffect(() => {
    if (!observerRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

  // Loading state
  if (isLoading) {
    return (
      <>
        <HeaderThree links="home" title="Flash Sale" />
        <div className="page-content-wrapper">
          <div className="top-products-area py-3">
            <div className="container">
              <div className="row g-2 rtl-flex-d-row-r">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="col-4">
                    <div className="card flash-sale-card">
                      <div className="card-body">
                        <div
                          className="skeleton"
                          style={{
                            width: "100%",
                            height: "120px",
                            backgroundColor: "#e0e0e0",
                            borderRadius: "4px",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (isError) {
    return (
      <>
        <HeaderThree links="home" title="Flash Sale" />
        <div className="page-content-wrapper">
          <div className="top-products-area py-3">
            <div className="container">
              <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Error Loading Flash Sales</h4>
                <p>
                  {error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again later."}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Get all flash sale products from pages
  const allProducts =
    data?.pages.flatMap((page) => page.flashSaleProduct) || [];

  // If no products, return null (don't render the component)
  if (allProducts.length === 0) {
    return null;
  }

  return (
    <>
      <HeaderThree links="home" title="Flash Sale" />

      <div className="page-content-wrapper">
        <div className="top-products-area py-3">
          <div className="container">
            <div className="row g-2 rtl-flex-d-row-r">
              {allProducts.map((item) => {
                const discount = calculateDiscount(
                  item.normal_price,
                  item.flash_price
                );
                const progressColor = getProgressBarColor(discount);

                return (
                  <div key={item.flash_sale_item_id} className="col-4">
                    <div className="card flash-sale-card">
                      <div className="card-body">
                        <Link href={`/flash-sale-product/${item.product_id}`}>
                          <ImageWithFallback
                            src={item.image_url}
                            alt={item.product_name}
                          />
                          <span className="product-title">
                            {item.product_name}
                          </span>
                          <p className="sale-price">
                            {formatCurrency(item.flash_price)}
                            <span className="real-price">
                              {formatCurrency(item.normal_price)}
                            </span>
                          </p>
                          <span className="progress-title">
                            {discount}% OFF
                          </span>

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
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Infinite scroll trigger */}
            {hasNextPage && (
              <div ref={observerRef} className="text-center py-3">
                {isFetchingNextPage && (
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />
    </>
  );
};

export default FlashSale;
