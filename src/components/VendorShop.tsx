"use client";
import top_product from "@/data/top_product";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetVendor,
  useGetVendorProductItems,
} from "@/queries/vendors.queries";
import { PageSuspense } from "./reuseable/PageSuspense";
import { useFilters } from "@/hooks/useFilters";
import ImageWithFallback from "./reuseable/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import { useAddToCart } from "@/hooks/useAddToCart";
import WishlistButton from "./reuseable/WishlistButton";

const MyTimer = dynamic(() => import("./common/Timer"), { ssr: false });

const VendorShop = ({ initialData }) => {
  if (typeof window !== "undefined") {
    require("bootstrap/dist/js/bootstrap");
  }
  const router = useRouter();

  // Review form state
  const [selectedRating, setSelectedRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // Cart hook
  const { handleAddToCart } = useAddToCart();

  const Filters = useFilters();

  const QueryOptions = { enabled: !!initialData };
  const queryClient = useQueryClient();
  const VendorQuery = useGetVendor(initialData.vendor_id);
  const VendorProductsQuery = useGetVendorProductItems(
    Filters,
    initialData.vendor_id,
    QueryOptions
  );

  useEffect(() => {
    if (initialData) {
      console.log(initialData);
      queryClient.setQueryData(
        ["get-vendor", initialData.vendor_id],
        initialData
      );
    }
  }, [initialData, queryClient]);

  useEffect(() => {
    console.log(initialData);
  }, [initialData]);

  //   flat map the items in the pages
  const vendors =
    VendorProductsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  if (!initialData || VendorQuery.isPending) {
    return <PageSuspense />;
  }

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement review submission logic
    console.log({ rating: selectedRating, review: reviewText });
    // Reset form
    setSelectedRating(0);
    setReviewText("");
  };

  return (
    <>
      <HeaderTwo links="shop-grid" title="Vendors" />
      <div className="page-content-wrapper pb-3">
        <div
          className="vendor-details-wrap bg-img bg-overlay py-4"
          style={{
            backgroundImage: `url(${VendorQuery.data.banner_url ||
              "/assets/img/vendor/vendor-banner.png"
              })`,
          }}
        >
          <div className="container">
            <div className="d-flex align-items-start">
              <div className="vendor-profile shadow me-3">
                <figure className="m-0">
                  <img
                    src={
                      VendorQuery.data.avatar_url ||
                      "/assets/img/vendor/vendor-avatar.png"
                    }
                    alt=""
                  />
                </figure>
              </div>

              <div className="vendor-info">
                <h6 className="mb-1 vendor-title text-white">
                  {VendorQuery.data.vendor_name}
                </h6>
                <p className="mb-1 text-white">
                  <i className="ti ti-map-pin me-1"></i>
                  {VendorQuery.data.address || "Location not specified"}
                </p>
                <div className="ratings lh-1">
                  <i className="ti ti-star-filled"></i>
                  <i className="ti ti-star-filled"></i>
                  <i className="ti ti-star-filled"></i>
                  <i className="ti ti-star-filled"></i>
                  <i className="ti ti-star-filled"></i>
                  <span className="text-white">(99% Positive Seller)</span>
                </div>
              </div>
            </div>

            <div className="vendor-basic-info d-flex align-items-center justify-content-between mt-4">
              <div className="single-basic-info">
                <div className="icon">
                  <i className="ti ti-shield-lock"></i>
                </div>
                <span>Trusted Seller</span>
              </div>
              <div className="single-basic-info">
                <div className="icon">
                  <i className="ti ti-basket"></i>
                </div>
                <span>{vendors && vendors.length} Items</span>
              </div>
              <div className="single-basic-info">
                <div className="icon">
                  <i className="ti ti-ship"></i>
                </div>
                <span>Ships On Time</span>
              </div>
            </div>
          </div>
        </div>

        <div className="vendor-tabs">
          <div className="container">
            <ul className="nav nav-tabs mb-3" id="vendorTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#home"
                  type="button"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true"
                >
                  About
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="products-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#products"
                  type="button"
                  role="tab"
                  aria-controls="products"
                  aria-selected="false"
                >
                  Products
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="reviews-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#reviews"
                  type="button"
                  role="tab"
                  aria-controls="reviews"
                  aria-selected="false"
                >
                  Reviews
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="tab-content" id="vendorTabContent">
          {/* About Tab */}
          <div
            className="tab-pane fade"
            id="home"
            role="tabpanel"
            aria-labelledby="home-tab"
          >
            <div className="container">
              <div className="card">
                <div className="card-body about-content-wrap dir-rtl">
                  <h6>Welcome to our shop gallery.</h6>
                  <p>
                    A versatile e-commerce shop template. It is very nicely
                    designed with modern features & coded with the latest
                    technology.
                  </p>
                  <ul className="mb-3 ps-3">
                    <li>
                      <i className="ti ti-circle-check me-1"></i>Trusted Seller
                    </li>
                    <li>
                      <i className="ti ti-circle-check me-1"></i>100+ Items
                    </li>
                    <li>
                      <i className="ti ti-circle-check me-1"></i>98% Ship On
                      Time
                    </li>
                  </ul>
                  <p>
                    It nicely views on all devices with smartphones, tablets,
                    laptops & desktops.
                  </p>
                  <img
                    className="mb-3 rounded"
                    src="/assets/img/bg-img/16.jpg"
                    alt=""
                  />
                  <p>
                    A versatile e-commerce shop template. It is very nicely
                    designed with modern features & coded with the latest
                    technology.
                  </p>
                  <p>
                    It nicely views on all devices with smartphones, tablets,
                    laptops & desktops.
                  </p>
                  <h6>Need Help?</h6>
                  <p>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Possimus sint reiciendis minima iusto ex beatae.
                  </p>
                  <div className="contact-btn-wrap text-center">
                    <p className="mb-2">
                      For more information, submit a request.
                    </p>
                    <Link className="btn btn-primary w-100" href="/contact">
                      <i className="ti ti-lifebuoy me-1 h6"></i>Submit A Query
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Tab */}
          <div
            className="tab-pane fade show active"
            id="products"
            role="tabpanel"
            aria-labelledby="products-tab"
          >
            <div className="container">
              {/* Loading State */}
              {VendorProductsQuery.isLoading && (
                <div className="row g-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="col-6 col-md-4">
                      <div className="card product-card h-100">
                        <div className="card-body">
                          <div className="skeleton-shimmer">
                            <div
                              className="skeleton-box rounded mb-3"
                              style={{ height: "140px", width: "100%" }}
                            ></div>
                            <div
                              className="skeleton-box rounded mb-2"
                              style={{ height: "16px", width: "80%" }}
                            ></div>
                            <div
                              className="skeleton-box rounded mb-2"
                              style={{ height: "20px", width: "50%" }}
                            ></div>
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
              )}

              {/* Error State */}
              {VendorProductsQuery.isError && (
                <div className="card">
                  <div className="card-body text-center py-5">
                    <div className="mb-3">
                      <i
                        className="ti ti-alert-circle text-danger"
                        style={{ fontSize: "48px" }}
                      ></i>
                    </div>
                    <h5 className="mb-2">Oops! Something went wrong</h5>
                    <p className="text-muted mb-3">
                      We couldn't load the products. Please try again.
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => VendorProductsQuery.refetch()}
                    >
                      <i className="ti ti-refresh me-1"></i>
                      Try Again
                    </button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!VendorProductsQuery.isLoading &&
                !VendorProductsQuery.isError &&
                vendors.length === 0 && (
                  <div className="card">
                    <div className="card-body text-center py-5">
                      <div className="mb-3">
                        <i
                          className="ti ti-package-off"
                          style={{ fontSize: "64px" }}
                        ></i>
                      </div>
                      <h5 className="mb-2">No Products Available</h5>
                      <p className="mb-3">
                        This vendor doesn't have any products listed at the
                        moment.
                        <br />
                        Please check back later.
                      </p>
                      <button
                        onClick={() => router.back()}
                        className="btn btn-outline-primary"
                      >
                        <i className="ti ti-arrow-left me-1"></i>
                        Browse Other Vendors
                      </button>
                    </div>
                  </div>
                )}

              {/* Products Grid - Matching Top Products Structure */}
              {!VendorProductsQuery.isLoading &&
                !VendorProductsQuery.isError &&
                vendors.length > 0 && (
                  <div className="row g-2">
                    {vendors.map((item, i) => (
                      <div key={i} className="col-6 col-md-4">
                        <div className="card product-card h-100">
                          <div className="card-body d-flex flex-column position-relative">
                            {/* Badge for first items */}
                            {(i === 0 || i === 1) && (
                              <span
                                className={`badge rounded-pill ${i === 0 ? "badge-success" : "badge-warning"
                                  }`}
                              >
                                {i === 0 ? "New" : "Sale"}
                              </span>
                            )}

                            {/* Wishlist Button */}
                            <WishlistButton vendorProductId={item.vendor_product_id} />

                            <Link
                              className="product-thumbnail d-block"
                              href={`/product/${item.vendor_product_id}`}
                            >
                              <ImageWithFallback
                                src={item.image_url}
                                alt={item.product_name}
                              />
                            </Link>

                            <Link
                              className="product-title d-block"
                              href={`/product/${item.vendor_product_id}`}
                            >
                              {item.product_name}
                            </Link>

                            <div className="mt-auto">
                              <p className="sale-price mb-1">
                                {formatCurrency(item.price)}
                              </p>

                              {/* Star Ratings */}
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
                                onClick={() => handleAddToCart(item)}
                                disabled={VendorProductsQuery.isFetching}
                              >
                                <i className="ti ti-plus"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* Load More Indicator */}
              {VendorProductsQuery.isFetchingNextPage && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading more...</span>
                  </div>
                  <p className="text-muted mt-2 mb-0">
                    Loading more products...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Tab */}
          <div
            className="tab-pane fade"
            id="reviews"
            role="tabpanel"
            aria-labelledby="reviews-tab"
          >
            <div className="rating-and-review-wrapper bg-white py-3 mb-3 dir-rtl">
              <div className="container">
                <div className="rating-review-content">
                  <ul className="ps-0">
                    <li className="single-user-review d-flex">
                      <div className="user-thumbnail">
                        <img src="/assets/img/bg-img/7.jpg" alt="" />
                      </div>
                      <div className="rating-comment">
                        <div className="rating">
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-filled"></i>
                        </div>
                        <p className="comment mb-0">
                          Very good product. It is just amazing!
                        </p>
                        <span className="name-date">
                          Designing World 12 Dec 2024
                        </span>
                        <a
                          className="review-image mt-2 border rounded"
                          href="img/product/3.png"
                        >
                          <img
                            className="rounded-3"
                            src="/assets/img/product/3.png"
                            alt=""
                          />
                        </a>
                      </div>
                    </li>

                    <li className="single-user-review d-flex">
                      <div className="user-thumbnail">
                        <img src="/assets/img/bg-img/8.jpg" alt="" />
                      </div>
                      <div className="rating-comment">
                        <div className="rating">
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-filled"></i>
                        </div>
                        <p className="comment mb-0">
                          Very excellent product. Love it.
                        </p>
                        <span className="name-date">
                          Designing World 8 Dec 2024
                        </span>
                        <a
                          className="review-image mt-2 border rounded"
                          href="img/product/4.png"
                        >
                          <img
                            className="rounded-3"
                            src="/assets/img/product/4.png"
                            alt=""
                          />
                        </a>
                        <a
                          className="review-image mt-2 border rounded"
                          href="img/product/6.png"
                        >
                          <img
                            className="rounded-3"
                            src="/assets/img/product/6.png"
                            alt=""
                          />
                        </a>
                      </div>
                    </li>

                    <li className="single-user-review d-flex">
                      <div className="user-thumbnail">
                        <img src="/assets/img/bg-img/9.jpg" alt="" />
                      </div>
                      <div className="rating-comment">
                        <div className="rating">
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-filled"></i>
                          <i className="ti ti-star-filled"></i>
                        </div>
                        <p className="comment mb-0">
                          What a nice product it is. I am looking for it.
                        </p>
                        <span className="name-date">
                          Designing World 28 Nov 2024
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="ratings-submit-form bg-white py-3 dir-rtl">
              <div className="container">
                <h6>Submit A Review</h6>
                <form onSubmit={handleReviewSubmit}>
                  <div className="stars mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <React.Fragment key={star}>
                        <input
                          className={`star-${star}`}
                          type="radio"
                          name="star"
                          id={`star${star}`}
                          checked={selectedRating === star}
                          onChange={() => setSelectedRating(star)}
                        />
                        <label
                          className={`star-${star}`}
                          htmlFor={`star${star}`}
                        ></label>
                      </React.Fragment>
                    ))}
                    <span></span>
                  </div>
                  <textarea
                    className="form-control mb-3"
                    id="comments"
                    name="comment"
                    cols={30}
                    rows={10}
                    data-max-length="200"
                    placeholder="Write your review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                  ></textarea>
                  <button className="btn btn-primary" type="submit">
                    Save Review
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />

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
    </>
  );
};

export default VendorShop;

