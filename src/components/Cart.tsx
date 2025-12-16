"use client";

import React from "react";
import Footer from "@/layouts/Footer";
import CartArea from "./common/CartArea";
import EmptyBag from "./common/EmptyBag";
import HeaderTwo from "@/layouts/HeaderTwo";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import useCartStore from "@/store/cartStore";

const Cart = () => {
  const { cart } = useCartStore();

  const productItem = useSelector((state: any) => state.cart.cart);
  let content = null;
  if (Object.values(cart).length === 0) content = <EmptyBag />;
  if (Object.values(cart).length > 0) content = <CartArea />;

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
