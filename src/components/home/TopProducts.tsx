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

const TopProducts = () => {
  const { user } = useAuthStore();
  const { addProductToCart } = useCartStore();

  // handleAdd to cart
  const { handleAddToCart } = useAddToCart();

  // handle add to wishlist
  const { addToWishList } = useAddToWishList();

  // const handleAddToCart = (item: any) => {
  //   addProductToCart(
  //     item,
  //     // vendor data
  //     {
  //       vendor_name: item.vendor_name,
  //       vendor_id: item.vendor_id,
  //       vendor_img: "/assets/img/vendor/vendor-avatar.png", //update this to the actual vendor avatar
  //       delivery_fee: item.vendor.delivery_fee,
  //     },
  //     user && user.id
  //   );
  // };

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
          <div className="row g-3">
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
          <div className="row g-3">
            {GetTopProducts.data &&
              GetTopProducts.data.map((item, i) => (
                <div key={i} className="col-6 col-md-4 col-lg-3">
                  <div className="card product-card">
                    <div className="card-body">
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

                      <div
                        onClick={() =>
                          addToWishList(
                            user?.id,
                            item.vendor_products_view.vendor_product_id
                          )
                        }
                        className="wishlist-btn"
                      >
                        <i className="ti ti-heart"></i>
                      </div>

                      <p className="sale-price mb-0">
                        {formatCurrency(item.vendor_products_view.price)}
                      </p>

                      <button
                        className="btn btn-primary btn-add-cart mt-2"
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
              ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default TopProducts;
