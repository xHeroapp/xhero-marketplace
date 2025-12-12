"use client";
import React, { useState } from "react";
import Link from "next/link";
import product_catagories from "@/data/product_catagories";
import { useGetProductCategories } from "@/queries/products.queries";

const ProductCatagories = () => {
  const [active, setActive] = useState();
  // data fetching (queries)
  const ProductCategoriesQuery = useGetProductCategories();

  // Loading state
  if (ProductCategoriesQuery.isLoading) {
    return (
      <div className="product-catagories-wrapper py-3">
        <div className="container">
          <div className="row g-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="col-3">
                <div className="card catagory-card">
                  <div className="card-body px-2">
                    <div className="placeholder-glow text-center">
                      <div
                        className="bg-secondary rounded-circle mx-auto mb-2"
                        style={{ width: "50px", height: "50px" }}
                      ></div>
                      <span className="placeholder col-8 d-block mx-auto"></span>
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
  if (ProductCategoriesQuery.isError) {
    return (
      <div className="product-catagories-wrapper py-3">
        <div className="container">
          <div className="card border-danger">
            <div className="card-body text-center py-5">
              <i
                className="ti ti-alert-circle text-danger"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="mt-3 mb-2">Unable to Load Categories</h5>
              <p className="text-muted mb-3">
                {ProductCategoriesQuery.error?.message ||
                  "Something went wrong while fetching categories."}
              </p>
              <button
                onClick={() => ProductCategoriesQuery.refetch()}
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
  if (
    !ProductCategoriesQuery.data ||
    ProductCategoriesQuery.data.length === 0
  ) {
    return (
      <div className="product-catagories-wrapper py-3">
        <div className="container">
          <div className="card">
            <div className="card-body text-center py-5">
              <i
                className="ti ti-category text-muted"
                style={{ fontSize: "3rem" }}
              ></i>
              <h5 className="mt-3 mb-2">No Categories Available</h5>
              <p className="text-muted mb-0">
                Product categories will appear here once they are added.
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
      <div className="product-catagories-wrapper py-3">
        <div className="container">
          <div className="row g-2 ">
            {ProductCategoriesQuery.data &&
              ProductCategoriesQuery.data.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className="col-3"
                >
                  <div
                    className={`card catagory-card ${
                      active === item.id ? "active" : ""
                    }`}
                  >
                    <div className="card-body px-2">
                      <Link href="/catagory">
                        <img src={item.img} alt="" />
                        <span>{item.name}</span>
                      </Link>
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

export default ProductCatagories;
