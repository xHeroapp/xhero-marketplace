"use client";
import best_seller from "@/data/best_seller";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import { addToCart } from "@/redux/features/cartSlice";
import NiceSelect from "@/ui/NiceSelect";
import Link from "next/link";
import React from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";

import { Swiper, SwiperSlide } from "swiper/react";

const product_categories = [
  {
    image: "/assets/img/product/5.png",
    title: "Furniture",
  },
  {
    image: "/assets/img/product/9.png",
    title: "Shoes",
  },
  {
    image: "/assets/img/product/4.png",
    title: "Dress",
  },
  {
    image: "/assets/img/product/9.png",
    title: "Shoes",
  },
  {
    image: "/assets/img/product/5.png",
    title: "Furniture",
  },
  {
    image: "/assets/img/product/4.png",
    title: "Dress",
  },
];

const ShopList = () => {
  const selectHandler = (e: any) => {};

  const dispatch = useDispatch();
  const handleAddToCart = (item: any) => {
    dispatch(addToCart(item));
  };

  return (
    <>
      <HeaderTwo links="home" title="Shop List" />
      <div className="page-content-wrapper">
        <div className="py-3">
          <div className="container">
            <div className="row g-1 align-items-center rtl-flex-d-row-r">
              <div className="col-8" style={{ marginTop: "-15px" }}>
                <Swiper
                  loop={true}
                  slidesPerView={2.5}
                  spaceBetween={5}
                  className="product-catagories owl-carousel catagory-slides"
                >
                  {product_categories.map((item, i) => (
                    <SwiperSlide key={i}>
                      <a className="shadow-sm" href="#">
                        <img src={item.image} alt="" />
                        {item.title}
                      </a>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <div className="col-4">
                <div className="select-product-catagory">
                  <NiceSelect
                    className="filter-select right small border-0 d-flex align-items-center"
                    options={[
                      { value: "00", text: "Short by" },
                      { value: "01", text: "Newest" },
                      { value: "02", text: "Popular" },
                      { value: "04", text: "Ratings" },
                    ]}
                    defaultCurrent={0}
                    onChange={selectHandler}
                    placeholder="Select an option"
                    name="myNiceSelect"
                  />
                </div>
              </div>
            </div>
            <div className="mb-3"></div>
            <div className="row g-2">
              {best_seller.map((item, i) => (
                <div key={i} className="col-12">
                  <div className="card horizontal-product-card">
                    <div className="d-flex align-items-center pt-3">
                      <div className="product-thumbnail-side">
                        <Link
                          className="product-thumbnail d-block"
                          href={`/single-product/${item.id}`}
                        >
                          <img src={item.img} alt="" />
                        </Link>
                        <a className="wishlist-btn" href="#">
                          <i className="ti ti-heart"></i>
                        </a>
                      </div>
                      <div className="product-description">
                        <Link
                          className="product-title d-block"
                          href={`/single-product/${item.id}`}
                        >
                          {item.title}
                        </Link>

                        <p className="sale-price">
                          <i className="ti ti-currency-dollar"></i>${" "}
                          {item.new_price}
                          <span>$ {item.old_price}</span>
                        </p>

                        <div className="product-rating">
                          <i className="ti ti-star-filled"></i> {item.ratting}{" "}
                          <span className="ms-1">
                            {"("} {item.review_text}{" "}
                            {item.review_text > 1 ? "reviews" : "review"} {")"}
                          </span>
                        </div>

                        <button
                          onClick={() => handleAddToCart(item)}
                          style={{ cursor: "pointer" }}
                          className="btn btn-success my-2"
                        >
                          Add to cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />
      <ToastContainer position="top-right" />
    </>
  );
};

export default ShopList;
