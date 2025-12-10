"use client";

import React from "react";
import Footer from "@/layouts/Footer";
import CartArea from "./common/CartArea";
import EmptyBag from "./common/EmptyBag";
import HeaderTwo from "@/layouts/HeaderTwo"; 
import {  useSelector } from "react-redux"; 
import { ToastContainer } from "react-toastify";

 

const Cart = () => {

	const productItem = useSelector((state: any) => state.cart.cart);
	let content = null;
	if (productItem.length === 0) content = <EmptyBag />
	if (productItem.length > 0) content = <CartArea />;



	return (
		<>
			<HeaderTwo links="shop-grid" title="My Cart" />
			{content} 
			<Footer />
			<ToastContainer position="top-right" />

		</>
	);
};

export default Cart;
