"use client";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import React from "react";
import ProductSlider from "./ProductSlider";
import SingleProductArea from "./SingleProductArea";
import { ToastContainer } from "react-toastify";
import ImageWithFallback from "../reuseable/ImageWithFallback";

const SingleProduct = ({ product }: any) => {
  console.log(product);
  return (
    <>
      <HeaderTwo links="shop-grid" title={product.product_name} />
      <div className="page-content-wrapper">
        {/* Product Image Container - Apple-style minimalism */}
        <div className="product-image-container">
          <div className="product-image-wrapper">
            <ImageWithFallback src={product.image_url} alt={product.product_name} />
            {/* Vendor Badge */}
            {product.vendor_name && (
              <div className="vendor-badge">
                {product.vendor_name}
              </div>
            )}
          </div>
        </div>
        <SingleProductArea product={product} />
      </div>

      <style jsx>{`
        .product-image-container {
          padding: 16px;
          background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
        }
        .product-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          max-width: 400px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.05),
            0 10px 15px -3px rgba(0, 0, 0, 0.08),
            0 20px 25px -5px rgba(0, 0, 0, 0.04);
        }
        .product-image-wrapper :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .product-image-wrapper:hover :global(img) {
          transform: scale(1.02);
        }
        .vendor-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          color: #1a1a1a;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }
      `}</style>
      <div className="internet-connection-status" id="internetStatus"></div>
      <Footer />
      <ToastContainer position="top-right" />
    </>
  );
};

export default SingleProduct;
