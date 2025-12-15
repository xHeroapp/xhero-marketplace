"use client";
import best_seller from "@/data/best_seller";
import { useGetWeeklyProducts } from "@/queries/products.queries";
import Link from "next/link";
import React from "react";
import ImageWithFallback from "../reuseable/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";

const WeeklyBestSellers = () => {
  //   data fetching
  const GetWeeklyProducts = useGetWeeklyProducts();

  // Loading state
  if (GetWeeklyProducts.isLoading) {
    return (
      <div className="weekly-best-seller-area py-3">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between dir-rtl">
            <h6>Weekly Best Sellers</h6>
            <Link className="btn btn-sm btn-light" href="/shop-list">
              View all<i className="ms-1 ti ti-arrow-right"></i>
            </Link>
          </div>
          <div className="row g-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="col-12">
                <div className="card horizontal-product-card">
                  <div className="d-flex align-items-center">
                    <div className="product-thumbnail-side">
                      <div className="placeholder-glow">
                        <div
                          className="product-thumbnail d-block bg-secondary rounded"
                          style={{ width: "100px", height: "100px" }}
                        ></div>
                      </div>
                    </div>
                    <div className="product-description">
                      <div className="placeholder-glow">
                        <span className="placeholder col-8 d-block mb-2"></span>
                        <span className="placeholder col-5 d-block"></span>
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
  if (GetWeeklyProducts.isError) {
    return (
      <div className="weekly-best-seller-area py-3">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between dir-rtl mb-3">
            <h6>Weekly Best Sellers</h6>
            <Link className="btn btn-sm btn-light" href="/shop-list">
              View all<i className="ms-1 ti ti-arrow-right"></i>
            </Link>
          </div>
          <div className="card border-danger">
            <div className="card-body text-center py-5">
              <i
                className="ti ti-alert-circle text-danger"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="mt-3 mb-2">Unable to Load Weekly Best Sellers</h5>
              <p className="text-muted mb-3">
                {GetWeeklyProducts.error?.message ||
                  "Something went wrong while fetching products."}
              </p>
              <button
                onClick={() => GetWeeklyProducts.refetch()}
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
  if (!GetWeeklyProducts.data || GetWeeklyProducts.data.length === 0) {
    return (
      <div className="weekly-best-seller-area py-3">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between dir-rtl mb-3">
            <h6>Weekly Best Sellers</h6>
            <Link className="btn btn-sm btn-light" href="/shop-list">
              View all<i className="ms-1 ti ti-arrow-right"></i>
            </Link>
          </div>
          <div className="card">
            <div className="card-body text-center py-5">
              <i
                className="ti ti-package text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="mt-3 mb-2">No Best Sellers Yet</h5>
              <p className="text-muted mb-0">
                Check back later for this week's best selling products.
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
      <div className="weekly-best-seller-area py-3">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between dir-rtl">
            <h6>Weekly Best Sellers</h6>
            <Link className="btn btn-sm btn-light" href="/shop-list">
              View all<i className="ms-1 ti ti-arrow-right"></i>
            </Link>
          </div>
          <div className="row g-2">
            {GetWeeklyProducts.data &&
              GetWeeklyProducts.data.map((item, i) => (
                <div key={i} className="col-12">
                  <div className="card horizontal-product-card">
                    <div className="d-flex align-items-center">
                      <div className="product-thumbnail-side">
                        <Link
                          className="product-thumbnail d-block"
                          href={`/product/${item.vendor_products_view.vendor_product_id}`}
                        >
                          <ImageWithFallback
                            src={item.vendor_products_view.image_url}
                            alt={item.vendor_products_view.product_name}
                          />
                        </Link>

                        {/* <a className="wishlist-btn" href="#">
												<i className="ti ti-heart"></i>
											</a> */}
                      </div>
                      <div className="product-description">
                        <Link
                          className="product-title d-block"
                          href={`/product/${item.vendor_products_view.vendor_product_id}`}
                        >
                          {item.vendor_products_view.product_name}
                        </Link>

                        <p className="sale-price">
                          {/* <i className="ti ti-currency-dollar"></i> */}
                          {formatCurrency(item.vendor_products_view.price)}
                          {/* <span>$ {item.old_price}</span> */}
                        </p>

                        {/* removed product rating for now */}
                        {/* <div className="product-rating">
												<i className="ti ti-star-filled"></i> {item.ratting}{" "}
												<span className="ms-1">
													{"("} {item.review_text}{" "}
													{item.review_text > 1 ? "reviews" : "review"} {")"}
												</span>
											</div> */}
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

export default WeeklyBestSellers;
