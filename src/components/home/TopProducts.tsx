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
import { useAddToWishList } from "@/hooks/useAddToWishList";
import MyTimer from "../common/MyTimer";

const TopProducts = () => {
  // handleAdd to cart
  const { handleAddToCart } = useAddToCart();

  // handle add to wishlist
  const { addToWishList } = useAddToWishList();

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
            {[...Array(8)].map((_, i) => (
              <div key={i} className="col-6 col-md-4 col-lg-3">
                <div className="card product-card">
                  <div className="card-body">
                    <div className="placeholder-glow">
                      <div
                        className="product-thumbnail d-block bg-secondary rounded mb-2"
                        style={{ height: "150px" }}
                      ></div>
                      <span className="placeholder col-8 d-block mb-2"></span>
                      <span className="placeholder col-6 d-block mb-2"></span>
                      <span className="placeholder col-12 btn btn-primary"></span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
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

                      <div
                        onClick={() =>
                          addToWishList(
                            item.vendor_products_view.vendor_product_id
                          )
                        }
                        className="wishlist-btn"
                      >
                        <i className="ti ti-heart"></i>
                      </div>

                      <Link
                        className="product-thumbnail d-block"
                        href={`/product/${item.vendor_products_view.vendor_product_id}`}
                      >
                        <ImageWithFallback
                          src={item.vendor_products_view.image_url}
                          alt={item.vendor_products_view.product_name}
                        />
                        {/* Timer for 1st and 4th item */}
                        {(i === 0 || i === 3) && (
                          <ul className="offer-countdown-timer d-flex align-items-center shadow-sm">
                            <MyTimer />
                          </ul>
                        )}
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
