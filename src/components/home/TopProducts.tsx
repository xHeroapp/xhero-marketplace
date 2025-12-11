"use client";

import top_product from "@/data/top_product";
import Link from "next/link";
import React from "react";

import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { useGetTopProducts } from "@/queries/products.queries";
import ImageWithFallback from "../reuseable/ImageWithFallback";
const MyTimer = dynamic(() => import("../common/Timer"), { ssr: false });

const TopProducts = () => {
  const dispatch = useDispatch();
  const handleAddToCart = (item: any) => {
    dispatch(addToCart(item));
  };

  //   data fetching
  const GetTopProducts = useGetTopProducts();

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
                  <div className="card product-card">
                    <div className="card-body">
                      {/* removed badges */}
                      {/* <span
											className={`badge rounded-pill badge-${item.badge_color}`}
										>
											{item.badge_text}
										</span> */}
                      <a className="wishlist-btn" href="#">
                        <i className="ti ti-heart"></i>
                      </a>
                      <Link
                        className="product-thumbnail d-block"
                        href={`/single-product/${item.vendor_products_view.product_id}`}
                      >
                        <ImageWithFallback
                          src={item.vendor_products_view.image_url}
                          alt={item.vendor_products_view.product_name}
                          // className="w-full h-[500px] object-cover"
                        />
                        {/* <img className="mb-2" src={item.vendor_products_view.image_url} alt="" /> */}
                        {i === 0 || i === 3 ? (
                          <ul className="offer-countdown-timer d-flex align-items-center shadow-sm">
                            <MyTimer />
                          </ul>
                        ) : null}
                      </Link>

                      <Link
                        className="product-title"
                        href={`/single-product/${item.vendor_products_view.product_id}`}
                      >
                        {item.vendor_products_view.product_name}
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
                      <a
                        className="btn btn-primary btn-sm"
                        onClick={() => handleAddToCart(item)}
                        style={{ cursor: "pointer" }}
                      >
                        <i className="ti ti-plus"></i>
                      </a>
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
