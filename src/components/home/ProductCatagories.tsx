"use client";
import React, { useState } from "react";
import Link from "next/link";
import product_catagories from "@/data/product_catagories";
import { useGetProductCategories } from "@/queries/products.queries";

const ProductCatagories = () => {
  const [active, setActive] = useState();
  // data fetching (queries)
  const ProductCategoriesQuery = useGetProductCategories();
  return (
    <>
      <div className="product-catagories-wrapper py-3">
        <div className="container">
          <div className="row g-2 rtl-flex-d-row-r">
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
