import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import React from "react";
import ProductSlider from "./ProductSlider";
import SingleProductArea from "./SingleProductArea";
import { ToastContainer } from "react-toastify";

const SingleProduct = ({product}: any) => {
	return (
		<>
			<HeaderTwo links="shop-grid" title="Single Product" />
			<div className="page-content-wrapper">
				<ProductSlider />
				<SingleProductArea product={product} />
			</div>
			<div className="internet-connection-status" id="internetStatus"></div>
			<Footer />
			<ToastContainer position="top-right" />

		</>
	);
};

export default SingleProduct;
