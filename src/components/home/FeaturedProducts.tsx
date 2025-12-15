"use client";
import featured_products from "@/data/featured_products";
import { useGetFeatureProducts } from "@/queries/products.queries";
import Link from "next/link";
import React, { useEffect } from "react";
import ImageWithFallback from "../reuseable/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";

const FeaturedProducts = () => {
  // Data fetching (query)
  const GetFeaturedProducts = useGetFeatureProducts();

  useEffect(() => {
    GetFeaturedProducts.isSuccess && console.log(GetFeaturedProducts.data);
  }, [GetFeaturedProducts.isSuccess]);

  // Loading state
  if (GetFeaturedProducts.isLoading) {
    return (
      <div className="featured-products-wrapper py-3">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between dir-rtl">
            <h6>Featured Products</h6>
            <Link className="btn btn-sm btn-light" href="/featured-products">
              View all
              <i className="ms-1 ti ti-arrow-right"></i>
            </Link>
          </div>
          <div className="row g-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="col-4">
                <div className="card featured-product-card">
                  <div className="card-body">
                    <span className="badge badge-warning custom-badge">
                      <i className="ti ti-star-filled"></i>
                    </span>
                    <div className="placeholder-glow">
                      <div className="product-thumbnail-side">
                        <div
                          className="product-thumbnail d-block bg-secondary rounded mb-2"
                          style={{ height: "120px" }}
                        ></div>
                      </div>
                      <div className="product-description">
                        <span className="placeholder col-10 d-block mb-2"></span>
                        <span className="placeholder col-6 d-block"></span>
                      </div>
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
  if (GetFeaturedProducts.isError) {
    return (
      <div className="featured-products-wrapper py-3">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between dir-rtl mb-3">
            <h6>Featured Products</h6>
            <Link className="btn btn-sm btn-light" href="/featured-products">
              View all
              <i className="ms-1 ti ti-arrow-right"></i>
            </Link>
          </div>
          <div className="card border-danger">
            <div className="card-body text-center py-5">
              <i
                className="ti ti-alert-circle text-danger"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="mt-3 mb-2">Unable to Load Featured Products</h5>
              <p className="text-muted mb-3">
                {GetFeaturedProducts.error?.message ||
                  "Something went wrong while fetching products."}
              </p>
              <button
                onClick={() => GetFeaturedProducts.refetch()}
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
  if (!GetFeaturedProducts.data || GetFeaturedProducts.data.length === 0) {
    return (
      <div className="featured-products-wrapper py-3">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between dir-rtl mb-3">
            <h6>Featured Products</h6>
            <Link className="btn btn-sm btn-light" href="/featured-products">
              View all
              <i className="ms-1 ti ti-arrow-right"></i>
            </Link>
          </div>
          <div className="card">
            <div className="card-body text-center py-5">
              <i
                className="ti ti-star text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="mt-3 mb-2">No Featured Products</h5>
              <p className="text-muted mb-0">
                Check back soon for our featured products.
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
      <div className="featured-products-wrapper py-3">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between dir-rtl">
            <h6>Featured Products</h6>
            <Link className="btn btn-sm btn-light" href="/featured-products">
              View all
              <i className="ms-1 ti ti-arrow-right"></i>
            </Link>
          </div>
          <div className="row g-2">
            {GetFeaturedProducts.data &&
              GetFeaturedProducts.data.map((item, i) => (
                <div key={i} className="col-4">
                  <div className="card featured-product-card">
                    <div className="card-body">
                      <span className="badge badge-warning custom-badge">
                        <i className="ti ti-star-filled"></i>
                      </span>
                      <div className="product-thumbnail-side">
                        <Link
                          className="product-thumbnail d-block"
                          href={`/product/${item.vendor_products_view.vendor_product_id}`}
                        >
                          <ImageWithFallback
                            src={item.vendor_products_view.image_url}
                            alt={item.vendor_products_view.product_name}
                            // className="w-full h-[500px] object-cover"
                          />
                          {/* <img src={item.img} alt={item.title} /> */}
                        </Link>
                      </div>
                      <div className="product-description">
                        <Link
                          className="product-title d-block"
                          href={`/product/${item.vendor_products_view.vendor_product_id}`}
                        >
                          {item.vendor_products_view.product_name}
                        </Link>
                        <p className="sale-price">
                          {formatCurrency(item.vendor_products_view.price)}
                          {/* <span>${item.old_price}</span> */}
                        </p>
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

export default FeaturedProducts;
