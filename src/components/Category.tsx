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
import { useSearchParams } from "next/navigation";
import { ProductsGrid } from "./ProductsGrid";
import { useGetProductItems } from "@/queries/products.queries";
import { useFilters } from "@/hooks/useFilters";
const MyTimer = dynamic(() => import("./common/Timer"), { ssr: false });

const Category = () => {
  const searchParams = useSearchParams();
  const activeCategory_id = searchParams.get("category_id");
  const activeCategory_name = searchParams.get("category_name");

  const { categories, loading, error } = useCategoryStore();
  const { sortedCategories } = useSortedCategories(categories);

  const Filters = useFilters();

  const [active, setActive] = useState(
    activeCategory_id ? activeCategory_id : sortedCategories[0].id
  );

  // filter the product by the active category
  useEffect(() => {
    if (activeCategory_name) {
      Filters.setCategory(activeCategory_name);
    } else {
      // this would sort by the first category on the list
      Filters.setCategory(sortedCategories[0].name);
    }
  }, [activeCategory_name, sortedCategories]);

  // Scroll to active category
  useEffect(() => {
    if (activeCategory_id && sortedCategories.length > 0) {
      const activeIndex = sortedCategories.findIndex(
        (cat) => cat.id === activeCategory_id
      );

      if (activeIndex !== -1) {
        const categoryElement = document.querySelectorAll(
          ".category-item-wrapper"
        )[activeIndex];
        if (categoryElement) {
          categoryElement.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        }
      }
    }
  }, [activeCategory_id, sortedCategories]);

  // get products
  const GetProductsQuery = useGetProductItems(Filters.filters, Filters.limit);

  useEffect(() => {
    GetProductsQuery.isSuccess && console.log(GetProductsQuery.data);
  }, [GetProductsQuery.isSuccess]);

  //   flat map the items in the pages
  const productItems =
    GetProductsQuery.data?.pages.flatMap((page) => page.items) ?? [];

  // Handle category changes
  function handleActiveCategory(item) {
    setActive(item.id);
    Filters.setCategory(item.name);
  }

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
                <div className="row g-2 rtl-flex-d-row-r">
                  {sortedCategories.map((item) => (
                    <div key={item.id} className="col-3">
                      <div className="category-item-wrapper h-100">
                        <div
                          onClick={() => handleActiveCategory(item)}
                          className={`card catagory-card ${active === item.id ? "active" : ""
                            } h-100`}
                        >
                          <div className="card-body px-2">
                            <Link href={`/category?category_id=${item.id}`}>
                              <img src={item.img} alt={item.name} />
                              <span>{item.name}</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
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
            {GetProductsQuery.isPending ? (
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
            ) : !productItems || productItems.length === 0 ? (
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
                  <Link href="/home" className="btn btn-primary">
                    <i className="ti ti-home me-2"></i>Go to Home
                  </Link>
                </div>
              </div>
            ) : GetProductsQuery.isError ? (
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
            ) : (
              <ProductsGrid
                productItems={productItems}
                GetProductsQuery={GetProductsQuery}
              />
            )}

            {/* <div className="row g-2 rtl-flex-d-row-r">
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
            </div> */}
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />

      {/* styles */}
      <style jsx>{`
        .category-item-wrapper {
          /* No specific width needed, flexible by col class */
        }

        .category-item-wrapper .catagory-card {
           /* h-100 handles height */
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
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }
      `}</style>
    </>
  );
};

export default Category;
