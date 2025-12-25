import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import React from "react";
import { ToastContainer } from "react-toastify";
import ImageWithFallback from "../reuseable/ImageWithFallback";
import FlashSaleSingleProductArea from "./FlashSaleSingleProduct";

const FlashSaleSingleProduct = ({ product }: any) => {
  console.log(product);
  return (
    <>
      <HeaderTwo links="shop-grid" title={product.product_name} />
      <div className="page-content-wrapper">
        {/* <ProductSlider product_images={product.image_url} /> */}
        <ImageWithFallback src={product.image_url} alt={product.product_name} />
        <FlashSaleSingleProductArea product={product} />
      </div>
      <div className="internet-connection-status" id="internetStatus"></div>
      <Footer />
      <ToastContainer position="top-right" />
    </>
  );
};

export default FlashSaleSingleProduct;
