"use client";
import product_catagories from "@/data/product_catagories";
import top_product from "@/data/top_product";
import Footer from "@/layouts/Footer";
import Link from "next/link";
import React, { useEffect, useState } from "react";

import dynamic from "next/dynamic";
import HeaderThree from "@/layouts/HeaderThree";
import useCartStore from "@/store/cartStore";
import { useCategoryStore } from "@/store/categoryStore";
import { useSortedCategories } from "@/hooks/useSortedCategories";
const MyTimer = dynamic(() => import("./common/Timer"), { ssr: false });

const Category = () => {
  const [active, setActive] = useState();

  const { categories, loading, error } = useCategoryStore();

  const { sortedCategories } = useSortedCategories(categories);

  useEffect(() => {
    console.log(categories);
  }, [categories]);

  return (
    <>
      <HeaderThree links="home" title="Product Category" />

      <div className="page-content-wrapper">
        <div className="pt-3">
          <div className="container">
            <div
              className="catagory-single-img"
              style={{ backgroundImage: `url(/assets/img/bg-img/5.jpg)` }}
            ></div>
          </div>
        </div>

        <div className="product-catagories-wrapper py-3">
          <div className="container">
            <div className="section-heading rtl-text-right">
              <h6>Categories</h6>
            </div>

            <div className="product-catagories-wrapper">
              <div className="container">
                <div className="categories-scroll-container">
                  <div className="categories-scroll-wrapper">
                    {sortedCategories.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setActive(item.id)}
                        className="category-item-wrapper"
                      >
                        <div
                          className={`card catagory-card ${
                            active === item.id ? "active" : ""
                          }`}
                        >
                          <div className="card-body px-2">
                            <Link href={`/category?category_id=${item.id}`}>
                              <img src={item.img} alt={item.name} />
                              <span>{item.name}</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="top-products-area pb-3">
          <div className="container">
            <div className="section-heading rtl-text-right">
              <h6>Products</h6>
            </div>
            <div className="row g-2 rtl-flex-d-row-r">
              {top_product.map((item, i) => (
                <div key={i} className="col-6 col-md-4">
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
                </div>
              ))}

              {top_product.map((item, i) => (
                <div key={i} className="col-6 col-md-4">
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />

      {/* styles */}
      <style jsx>{`
        .categories-scroll-container {
          overflow-x: auto;
          overflow-y: hidden;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }

        .categories-scroll-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }

        .categories-scroll-wrapper {
          display: flex;
          gap: 0.5rem;
          padding-bottom: 0.5rem;
        }

        .category-item-wrapper {
          flex: 0 0 auto;
          width: 100px;
        }

        .category-item-wrapper .catagory-card {
          height: 100%;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .category-item-wrapper .catagory-card:hover {
          // transform: translateY(-2px);
          // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .category-item-wrapper .catagory-card.active {
          // border-color: var(--bs-primary);
          // box-shadow: 0 0 0 2px var(--bs-primary);
        }

        .category-item-wrapper .card-body {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .category-item-wrapper img {
          width: 50px;
          height: 50px;
          object-fit: contain;
          margin-bottom: 0.5rem;
        }

        .category-item-wrapper span {
          font-size: 0.75rem;
          line-height: 1.2;
          display: block;
          word-wrap: break-word;
          max-width: 100%;
        }
      `}</style>
    </>
  );
};

export default Category;
