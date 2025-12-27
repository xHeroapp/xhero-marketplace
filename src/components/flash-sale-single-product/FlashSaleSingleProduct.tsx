"use client";
import Link from "next/link";
import React, { useState } from "react";
import { formatCurrency } from "@/utils/formatCurrency";
import dynamic from "next/dynamic";

import useFlashSaleStore from "@/store/flashSaleStore";
import { useRouter } from "next/navigation";

const MyTimer = dynamic(() => import("../common/Timer"), { ssr: false });

const FlashSaleSingleProductArea = ({ product }: any) => {
  const { setFlashSaleItem } = useFlashSaleStore();
  const router = useRouter();

  // handle flash sale
  function handleAddFlashSaleItem() {
    setFlashSaleItem(product);

    router.push("/checkout-flash-sale");
  }

  // Calculate stock percentage
  const calculateStockPercentage = () => {
    if (!product.normal_stock || !product.flash_stock) return 0;
    const soldStock = product.normal_stock - product.flash_stock;
    return Math.round((soldStock / product.normal_stock) * 100);
  };

  // Get stock status color
  const getStockStatusColor = () => {
    if (!product.flash_stock) return "danger";
    if (product.flash_stock <= 10) return "danger";
    if (product.flash_stock <= 30) return "warning";
    return "success";
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!product.normal_price || !product.flash_price) return 0;
    const normal = parseFloat(product.normal_price);
    const flash = parseFloat(product.flash_price);
    return Math.round(((normal - flash) / normal) * 100);
  };

  const stockPercentage = calculateStockPercentage();
  const stockStatusColor = getStockStatusColor();
  const discountPercentage = calculateDiscount();

  return (
    <>
      <div className="product-description pb-3">
        <div className="product-title-meta-data bg-white mb-3 py-3">
          <div className="container d-flex justify-content-between rtl-flex-d-row-r">
            <div className="p-title-price">
              <h5 className="mb-1"> {product.product_name}</h5>
              <p className="sale-price mb-0 lh-1">
                {formatCurrency(product?.flash_price || product?.price)}
                <span> {formatCurrency(product?.normal_price)}</span>
              </p>
              {discountPercentage > 0 && (
                <span
                  className="badge bg-danger"
                  style={{ fontSize: "12px", marginTop: "4px" }}
                >
                  {discountPercentage}% OFF
                </span>
              )}
              <p className="mt-2">{product.product_description}</p>
            </div>
            {/* <div
              onClick={() => addToWishList(product.vendor_product_id)}
              className="p-wishlist-share"
            >
              <div>
                <i className="ti ti-heart"></i>
              </div>
            </div> */}
          </div>
          <div className="container">
            <h6>
              Vendor
              <span>
                <p>
                  <Link href={`/vendor-shop`}>{product.vendor_name}</Link>
                </p>
              </span>
            </h6>
          </div>
          {/* Removed product rating for now */}
          {/* <div className="product-ratings">
            <div className="container d-flex align-items-center justify-content-between rtl-flex-d-row-r">
              <div className="ratings">
                <i className="ti ti-star-filled"></i>
                <i className="ti ti-star-filled"></i>
                <i className="ti ti-star-filled"></i>
                <i className="ti ti-star-filled"></i>
                <i className="ti ti-star-filled"></i>
                <span className="ps-1">3 ratings</span>
              </div>
              <div className="total-result-of-ratings">
                <span>5.0</span>
                <span>Very Good </span>
              </div>
            </div>
          </div> */}
        </div>

        {/* Flash Sale Panel - Now Active */}
        {product.flash_sale_id && (
          <div className="flash-sale-panel bg-white mb-3 py-3">
            <div className="container">
              <div className="sales-offer-content d-flex align-items-end justify-content-between">
                <div className="sales-end">
                  <p className="mb-1 font-weight-bold">
                    <i className="ti ti-bolt-lightning lni-flashing-effect text-danger"></i>
                    Flash sale ends in
                  </p>

                  <ul className="sales-end-timer ps-0 d-flex align-items-center">
                    <MyTimer endTime={product.end_time} />
                  </ul>
                </div>

                <div className="sales-volume text-end">
                  <p className="mb-1 font-weight-bold">
                    {stockPercentage}% Sold Out
                  </p>
                  <div className="progress" style={{ height: "0.375rem" }}>
                    <div
                      className={`progress-bar bg-${stockStatusColor}`}
                      role="progressbar"
                      style={{ width: `${stockPercentage}%` }}
                      aria-valuenow={stockPercentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Stock Information */}
              <div
                className="stock-info mt-3 pt-3"
                style={{ borderTop: "1px solid #e9ecef" }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <p className="mb-0" style={{ fontSize: "14px" }}>
                      <i className="ti ti-package me-1"></i>
                      <strong>Stock Available:</strong>
                    </p>
                  </div>
                  <div>
                    <span
                      className={`badge bg-${stockStatusColor}`}
                      style={{ fontSize: "13px" }}
                    >
                      {product.flash_stock} items left
                    </span>
                  </div>
                </div>

                {product.flash_stock <= 10 && product.flash_stock > 0 && (
                  <div className="mt-2">
                    <small className="text-danger">
                      <i className="ti ti-alert-circle me-1"></i>
                      Hurry! Only {product.flash_stock} items remaining at this
                      price
                    </small>
                  </div>
                )}

                {product.flash_stock === 0 && (
                  <div className="mt-2">
                    <small className="text-danger fw-bold">
                      <i className="ti ti-x me-1"></i>
                      Out of Stock - Flash Sale Ended
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="cart-form-wrapper bg-white mb-3 py-3">
          <div className="container">
            <form className="cart-form" onSubmit={(e) => e.preventDefault()}>
              {/* <div className="order-plus-minus d-flex align-items-center">
                <div className="quantity-button-handler" onClick={decrement}>
                  -
                </div>
                <input
                  className="form-control cart-quantity-input"
                  type="text"
                  step="1"
                  name="quantity"
                  value={quantity}
                  defaultValue={0}
                  readOnly
                />
                <div className="quantity-button-handler" onClick={increment}>
                  +
                </div>
              </div> */}
              <button
                onClick={() => product && handleAddFlashSaleItem()}
                style={{ cursor: "pointer" }}
                className="btn btn-primary ms-3"
                type="submit"
                disabled={product.flash_stock === 0}
              >
                {product.flash_stock === 0 ? "Out of Stock" : "Buy Now"}
              </button>
            </form>
          </div>
        </div>

        {/* removed product specfication for now */}
        {/* return the product long descriptions here */}
        {/* <div className="p-specification bg-white mb-3 py-3">
          <div className="container">
            <h6>Description</h6>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
              eum? Id, culpa? At officia quisquam laudantium nisi mollitia
              nesciunt, qui porro asperiores cum voluptates placeat similique
              recusandae in facere quos vitae?
            </p>
            <ul className="mb-3 ps-3">
              <li>
                <i className="ti ti-check me-1"></i> 100% Good Reviews
              </li>
              <li>
                <i className="ti ti-check me-1"></i> 7 Days Returns
              </li>
              <li>
                {" "}
                <i className="ti ti-check me-1"></i> Warranty not Aplicable
              </li>
              <li>
                {" "}
                <i className="ti ti-check me-1"></i> 100% Brand New Product
              </li>
            </ul>
            <p className="mb-0">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi,
              eum? Id, culpa? At officia quisquam laudantium nisi mollitia
              nesciunt, qui porro asperiores cum voluptates placeat similique
              recusandae in facere quos vitae?
            </p>
          </div>
        </div> */}

        {/* removed the video pop up, our products do not have videos  */}
        {/* <div
          className="bg-img"
          style={{ backgroundImage: `url(/assets/img/product/18.jpg)` }}
        >
          <div className="container">
            <div className="video-cta-content d-flex align-items-center justify-content-center">
              <div className="video-text text-center">
                <h4 className="mb-4">Summer Clothing</h4>
                <VideoPopup>
                  <a
                    className="btn btn-primary rounded-circle"
                    id="videoButton"
                    href="https://www.youtube.com/watch?v=zE_WFiHnSlY"
                    style={{ cursor: "pointer" }}
                  >
                    <i className="ti ti-player-play"></i>
                  </a>
                </VideoPopup>
              </div>
            </div>
          </div>
        </div> */}
        <div className="pb-3"></div>

        {/* removed related products for now */}
        {/* <div className="related-product-wrapper bg-white py-3 mb-3">
                            <div className="container">
                                <div className="section-heading d-flex align-items-center justify-content-between rtl-flex-d-row-r">
                                    <h6>Related Products</h6>
                                    <Link className="btn btn-sm btn-secondary" href="/shop-grid">
                                        View all
                                    </Link>
                                </div>
                                <Swiper
                                    loop={true}
                                    slidesPerView={2}
                                    spaceBetween={10}
                                    autoplay={true}
                                    modules={[Autoplay]}
                                    className="related-product-slide owl-carousel"
                                >
                                    {top_product.map((item, i) => (
                                        <SwiperSlide key={i} className="col-6 col-md-4">
                                            <div className="card product-card">
                                                <div className="card-body">
                                                    <span
                                                        className={`badge rounded-pill badge-${item.badge_color}`}
                                                    >
                                                        {item.badge_text}
                                                    </span>
                                                    <a className="wishlist-btn" href="#">
                                                        <i className="ti ti-heart"></i>
                                                    </a>
                                                    <Link
                                                        className="product-thumbnail d-block"
                                                        href="/single-product"
                                                    >
                                                        <img className="mb-2" src={item.img} alt="" />
                                                        {i === 0 || i === 3 ? (
                                                            <ul className="offer-countdown-timer d-flex align-items-center shadow-sm">
                                                                <MyTimer />
                                                            </ul>
                                                        ) : null}
                                                    </Link>

                                                    <Link className="product-title" href="/single-product">
                                                        {item.title}
                                                    </Link>

                                                    <p className="sale-price">
                                                        $ {item.new_price}
                                                        <span>$ {item.old_price}</span>
                                                    </p>

                                                    <div className="product-rating">
                                                        <i className="ti ti-star-filled"></i>
                                                        <i className="ti ti-star-filled"></i>
                                                        <i className="ti ti-star-filled"></i>
                                                        <i className="ti ti-star-filled"></i>
                                                        <i className="ti ti-star-filled"></i>
                                                    </div>
                                                    <a className="btn btn-primary btn-sm" href="#">
                                                        <i className="ti ti-plus"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div> */}

        {/* removed product reviews for now */}
        {/* <div className="rating-and-review-wrapper bg-white py-3 mb-3 dir-rtl">
                            <div className="container">
                                <h6>Ratings & Reviews</h6>
                                <div className="rating-review-content">
                                    <ul className="ps-0">

                                        {reviews_data.map((item, i) => (
                                            <li key={i} className="single-user-review d-flex">
                                                <div className="user-thumbnail">
                                                    <img src={item.img} alt="" />
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
                                                        {item.title}
                                                    </p>
                                                    <span className="name-date">
                                                        {item.date}
                                                    </span>


                                                    {item.images.map((image, index) => (
                                                        <a key={index}
                                                            className="review-image mt-2 border rounded"
                                                            style={{ cursor: "pointer" }} 
                                                        >
                                                            <img
                                                                className="rounded-3"
                                                                src={image.img}
                                                                alt=""
                                                            />
                                                        </a>
                                                    ))}



                                                </div>
                                            </li>
                                        ))}

                                    </ul>
                                </div>
                            </div>
                        </div> */}

        {/* Removed the send Reviews */}
        {/* <div className="ratings-submit-form bg-white py-3 dir-rtl">
          <div className="container">
            <h6>Submit A Review</h6>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="stars mb-3">
                <input className="star-1" type="radio" name="star" id="star1" />
                <label className="star-1" htmlFor="star1"></label>
                <input className="star-2" type="radio" name="star" id="star2" />
                <label className="star-2" htmlFor="star2"></label>
                <input className="star-3" type="radio" name="star" id="star3" />
                <label className="star-3" htmlFor="star3"></label>
                <input className="star-4" type="radio" name="star" id="star4" />
                <label className="star-4" htmlFor="star4"></label>
                <input className="star-5" type="radio" name="star" id="star5" />
                <label className="star-5" htmlFor="star5"></label>
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
              ></textarea>
              <button className="btn btn-primary" type="submit">
                Save Review
              </button>
            </form>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default FlashSaleSingleProductArea;
