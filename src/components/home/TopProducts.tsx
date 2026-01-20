"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { useGetTopProducts } from "@/queries/products.queries";
import ImageWithFallback from "../reuseable/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";
import useCartStore from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { useAddToCart } from "@/hooks/useAddToCart";
import { toast } from "sonner";
import WishlistButton from "../reuseable/WishlistButton";

const TopProducts = () => {
  // handleAdd to cart
  const { handleAddToCart } = useAddToCart();

  //   data fetching
  const GetTopProducts = useGetTopProducts();

  // Loading state
  if (GetTopProducts.isLoading) {
    return (
      <div className="top-products-area py-3">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between dir-rtl">
            <h6>Top Products</h6>
            <Link className="btn btn-sm btn-light" href="/shop-grid">
              View all<i className="ms-1 ti ti-arrow-right"></i>
            </Link>
          </div>
          <div className="row g-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="col-6 col-md-4">
                <div className="card product-card h-100">
                  <div className="card-body">
                    <div className="skeleton-shimmer">
                      {/* Image placeholder */}
                      <div
                        className="skeleton-box rounded mb-3"
                        style={{ height: "140px", width: "100%" }}
                      ></div>
                      {/* Title placeholder */}
                      <div
                        className="skeleton-box rounded mb-2"
                        style={{ height: "16px", width: "80%" }}
                      ></div>
                      {/* Price placeholder */}
                      <div
                        className="skeleton-box rounded mb-2"
                        style={{ height: "20px", width: "50%" }}
                      ></div>
                      {/* Rating placeholder */}
                      <div className="d-flex align-items-center gap-1">
                        {[...Array(5)].map((_, j) => (
                          <div
                            key={j}
                            className="skeleton-box rounded-circle"
                            style={{ height: "10px", width: "10px" }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <style jsx>{`
          .skeleton-shimmer {
            position: relative;
          }
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

  // Error state
  if (GetTopProducts.isError) {
    return (
      <div className="top-products-area py-3">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between dir-rtl mb-3">
            <h6>Top Products</h6>
            <Link className="btn btn-sm btn-light" href="/shop-grid">
              View all<i className="ms-1 ti ti-arrow-right"></i>
            </Link>
          </div>
          <div className="card border-danger">
            <div className="card-body text-center py-5">
              <i
                className="ti ti-alert-circle text-danger"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="mt-3 mb-2">Unable to Load Products</h5>
              <p className="text-muted mb-3">
                {GetTopProducts.error?.message ||
                  "Something went wrong while fetching products."}
              </p>
              <button
                onClick={() => GetTopProducts.refetch()}
                className="btn btn-danger"
              >
                <i className="ti ti-refresh me-2"></i>Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!GetTopProducts.data || GetTopProducts.data.length === 0) {
    return (
      <div className="top-products-area py-3">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between dir-rtl mb-3">
            <h6>Top Products</h6>
            <Link className="btn btn-sm btn-light" href="/shop-grid">
              View all<i className="ms-1 ti ti-arrow-right"></i>
            </Link>
          </div>
          <div className="card">
            <div className="card-body text-center py-5">
              <i
                className="ti ti-package text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="mt-3 mb-2">No Products Available</h5>
              <p className="text-muted mb-0">
                Check back later for our top products.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state with data
  return (
    <>
      <div className="top-products-area py-3">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between dir-rtl">
            <h6>Top Products</h6>
            <Link className="btn btn-sm btn-light" href="/shop-grid">
              View all<i className="ms-1 ti ti-arrow-right"></i>
            </Link>
          </div>
          <div className="row g-2">
            {GetTopProducts.data &&
              GetTopProducts.data.map((item, i) => (
                <div key={i} className="col-6 col-md-4">
                  <div className="card product-card h-100">
                    <div className="card-body d-flex flex-column position-relative">
                      {(i === 0 || i === 1) && (
                        <span
                          className={`badge rounded-pill ${i === 0 ? "badge-success" : "badge-warning"
                            }`}
                        >
                          {i === 0 ? "New" : "Sale"}
                        </span>
                      )}

                      <WishlistButton vendorProductId={item.vendor_products_view.vendor_product_id} />

                      <Link
                        className="product-thumbnail d-block"
                        href={`/product/${item.vendor_products_view.vendor_product_id}`}
                      >
                        <ImageWithFallback
                          src={item.vendor_products_view.image_url}
                          alt={item.vendor_products_view.product_name}
                        />
                      </Link>

                      <Link
                        className="product-title d-block"
                        href={`/product/${item.vendor_products_view.vendor_product_id}`}
                      >
                        {item.vendor_products_view.product_name}
                      </Link>

                      <div className="mt-auto">
                        <p className="sale-price mb-1">
                          {formatCurrency(item.vendor_products_view.price)}
                        </p>

                        <div className="product-rating mb-2">
                          {[...Array(5)].map((_, starIndex) => (
                            <i
                              key={starIndex}
                              className="ti ti-star-filled"
                            ></i>
                          ))}
                        </div>

                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() =>
                            handleAddToCart(item.vendor_products_view)
                          }
                          disabled={GetTopProducts.isFetching}
                        >
                          <i className="ti ti-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>


    </>
  );
};

export default TopProducts;
