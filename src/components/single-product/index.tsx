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
      <HeaderTwo links="shop-grid" title="Single Product" />
      <div className="page-content-wrapper">
        {/* <ProductSlider product_images={product.image_url} /> */}
        <ImageWithFallback src={product.image_url} alt={product.product_name} />
        <SingleProductArea product={product} />
      </div>
      <div className="internet-connection-status" id="internetStatus"></div>
      <Footer />
      <ToastContainer position="top-right" />
    </>
  );
};

export default SingleProduct;
