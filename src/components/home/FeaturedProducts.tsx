"use client";
import featured_products from "@/data/featured_products";
import { useGetFeatureProducts } from "@/queries/products.queries";
import Link from "next/link";
import React, { useEffect } from "react";
import ImageWithFallback from "../reuseable/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";

const FeaturedProducts = () => {
  // Data fetching (query)
  const GetFeaturedProducts = useGetFeatureProducts();

  useEffect(() => {
    GetFeaturedProducts.isSuccess && console.log(GetFeaturedProducts.data);
  }, [GetFeaturedProducts.isSuccess]);

  return (
    <>
      <div className="featured-products-wrapper py-3">
        <div className="container">
          <div className="section-heading d-flex align-items-center justify-content-between dir-rtl">
            <h6>Featured Products</h6>
            <Link className="btn btn-sm btn-light" href="/featured-products">
              View all
              <i className="ms-1 ti ti-arrow-right"></i>
            </Link>
          </div>
          <div className="row g-2">
            {GetFeaturedProducts.data &&
              GetFeaturedProducts.data.map((item, i) => (
                <div key={i} className="col-4">
                  <div className="card featured-product-card">
                    <div className="card-body">
                      <span className="badge badge-warning custom-badge">
                        <i className="ti ti-star-filled"></i>
                      </span>
                      <div className="product-thumbnail-side">
                        <Link
                          className="product-thumbnail d-block"
                          href="/single-product"
                        >
                          <ImageWithFallback
                            src={item.vendor_products_view.image_url}
                            alt={item.vendor_products_view.product_name}
                            // className="w-full h-[500px] object-cover"
                          />
                          {/* <img src={item.img} alt={item.title} /> */}
                        </Link>
                      </div>
                      <div className="product-description">
                        <Link
                          className="product-title d-block"
                          href="/single-product"
                        >
                          {item.vendor_products_view.product_name}
                        </Link>
                        <p className="sale-price">
                          {formatCurrency(item.vendor_products_view.price)}
                          {/* <span>${item.old_price}</span> */}
                        </p>
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

export default FeaturedProducts;
