"use client";
import React from "react";
import Link from "next/link";
import Footer from "@/layouts/Footer";
import NiceSelect from "@/ui/NiceSelect";
import top_product from "@/data/top_product";
import HeaderTwo from "@/layouts/HeaderTwo";
import { Swiper, SwiperSlide } from "swiper/react";

import dynamic from "next/dynamic";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/features/cartSlice";
import { ToastContainer } from "react-toastify";
import {
  useGetProductCategories,
  useGetProductItems,
} from "@/queries/products.queries";
import { useFilters } from "@/hooks/useFilters";
import ImageWithFallback from "./reuseable/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";
const MyTimer = dynamic(() => import("../components/common/Timer"), {
  ssr: false,
});

const ShopGrid = () => {
  const selectHandler = (e: any) => {};

  const dispatch = useDispatch();
  const handleAddToCart = (item: any) => {
    dispatch(addToCart(item));
  };

  const Filters = useFilters();

  // data fetching
  const ProductCategoriesQuery = useGetProductCategories();

  const GetProductsQuery = useGetProductItems(Filters.filters, Filters.limit);

  //   flat map the items in the pages
  const productItems =
    GetProductsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  // Loading state for initial load
  if (GetProductsQuery.isLoading) {
    return (
      <>
        <HeaderTwo links="home" title="Shop Grid" />

        <div className="page-content-wrapper">
          <div className="py-3">
            <div className="container">
              <div className="row g-1 align-items-center rtl-flex-d-row-r">
                <div className="col-8" style={{ marginTop: "-15px" }}>
                  <div className="placeholder-glow d-flex gap-2">
                    {[...Array(3)].map((_, i) => (
                      <span
                        key={i}
                        className="placeholder col-3 rounded"
                      ></span>
                    ))}
                  </div>
                </div>
                <div className="col-4">
                  <div className="placeholder-glow">
                    <span className="placeholder col-12 rounded"></span>
                  </div>
                </div>
              </div>
              <div className="mb-3"></div>
              <div className="row g-2 rtl-flex-d-row-r">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="col-6 col-md-4">
                    <div className="card product-card">
                      <div className="card-body">
                        <div className="placeholder-glow">
                          <div
                            className="bg-secondary rounded mb-3"
                            style={{ height: "200px" }}
                          ></div>
                          <span className="placeholder col-10 d-block mb-2"></span>
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
        </div>

        <Footer />
        <ToastContainer position="top-right" />
      </>
    );
  }

  // Error state
  if (GetProductsQuery.isError) {
    return (
      <>
        <HeaderTwo links="home" title="Shop Grid" />

        <div className="page-content-wrapper">
          <div className="py-3">
            <div className="container">
              <div className="card border-danger">
                <div className="card-body text-center py-5">
                  <i
                    className="ti ti-alert-circle text-danger"
                    style={{ fontSize: "3rem" }}
                  ></i>
                  <h5 className="mt-3 mb-2">Unable to Load Products</h5>
                  <p className="text-muted mb-3">
                    {GetProductsQuery.error?.message ||
                      "Something went wrong while fetching products."}
                  </p>
                  <button
                    onClick={() => GetProductsQuery.refetch()}
                    className="btn btn-danger"
                  >
                    <i className="ti ti-refresh me-2"></i>Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
        <ToastContainer position="top-right" />
      </>
    );
  }

  // Empty state
  if (!productItems || productItems.length === 0) {
    return (
      <>
        <HeaderTwo links="home" title="Shop Grid" />

        <div className="page-content-wrapper">
          <div className="py-3">
            <div className="container">
              <div className="row g-1 align-items-center rtl-flex-d-row-r mb-3">
                <div className="col-8" style={{ marginTop: "-15px" }}>
                  <Swiper
                    loop={true}
                    slidesPerView={2.5}
                    spaceBetween={5}
                    className="product-catagories owl-carousel catagory-slides"
                  >
                    {ProductCategoriesQuery.data &&
                      ProductCategoriesQuery.data.map((item, i) => (
                        <SwiperSlide key={item.id}>
                          <a className="shadow-sm" href="#">
                            {/* <img src={item.img} alt="" /> */}
                            {item.name}
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

              <div className="card">
                <div className="card-body text-center py-5">
                  <i
                    className="ti ti-shopping-bag text-muted"
                    style={{ fontSize: "3rem" }}
                  ></i>
                  <h5 className="mt-3 mb-2">No Products Found</h5>
                  <p className="text-muted mb-3">
                    Try adjusting your filters or check back later for new
                    products.
                  </p>
                  <Link href="/" className="btn btn-primary">
                    <i className="ti ti-home me-2"></i>Go to Home
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Footer />
        <ToastContainer position="top-right" />
      </>
    );
  }

  // Success state with data
  return (
    <>
      <HeaderTwo links="home" title="Shop Grid" />

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
                  {ProductCategoriesQuery.data &&
                    ProductCategoriesQuery.data.map((item, i) => (
                      <SwiperSlide key={item.id}>
                        <a className="shadow-sm" href="#">
                          {/* <img src={item.img} alt="" /> */}
                          {item.name}
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
            <div className="row g-2 rtl-flex-d-row-r">
              {productItems &&
                productItems.map((product, i) => (
                  <div
                    key={product.vendor_product_id}
                    className="col-6 col-md-4"
                  >
                    <div className="card product-card">
                      <div className="card-body">
                        {/* removed badge and wishlist buttons for now */}
                        {/* <span
                        className={`badge rounded-pill badge-${product.badge_color}`}
                      >
                        {product.badge_text}
                      </span>
                      <a className="wishlist-btn" href="#">
                        <i className="ti ti-heart"></i>
                      </a> */}
                        <Link
                          className="product-thumbnail d-block"
                          href={`/product/${product.vendor_product_id}`}
                        >
                          <ImageWithFallback
                            src={product.image_url}
                            alt={product.product_name}
                          />
                          {/* Removed sale count down timer */}
                          {/* {i === 0 || i === 3 ? (
                          <ul className="offer-countdown-timer d-flex align-items-center shadow-sm">
                            <MyTimer />
                          </ul>
                        ) : null} */}
                        </Link>
                        <Link
                          className="product-title"
                          href={`/product/${product.vendor_product_id}`}
                        >
                          {product.product_name}
                        </Link>
                        <p className="sale-price">
                          {formatCurrency(product.price)}
                          {/* <span>$ {product.old_price}</span> */}
                        </p>
                        {/* Removed ratings for now */}
                        {/* <div className="product-rating">
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                        <i className="ti ti-star-filled"></i>
                      </div> */}
                        <a
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAddToCart(product)}
                          style={{ cursor: "pointer" }}
                        >
                          <i className="ti ti-plus"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Load More or Fetching Indicator */}
            {GetProductsQuery.isFetching && !GetProductsQuery.isLoading && (
              <div className="text-center mt-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <ToastContainer position="top-right" />
    </>
  );
};

export default ShopGrid;
