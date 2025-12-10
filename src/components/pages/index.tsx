

import Footer from "@/layouts/Footer";
import Header from "@/layouts/Header";
import Link from "next/link";
import React from "react";


const Pages = () => {
  return (
    <>
      <Header />
      <div className="page-content-wrapper py-3">
        <div className="container">
          <ul className="page-nav ps-0">

            <li><Link href="/home">Home<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/intro">Intro/Flash Screen<i className="ti ti-arrow-right"></i></Link></li>

            <li className="nav-title">Shop</li>
            <li><Link href="/shop-grid">Shop Grid<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/shop-list">Shop List<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/single-product">Product Details<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/catagory">Catagory<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/sub-catagory">Sub Catagory<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/wishlist-grid">Wishlist Grid<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/wishlist-list">Wishlist List<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/flash-sale">Flash Sale<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/featured-products">Featured Products<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/my-order">Order Status<i className="ti ti-arrow-right"></i></Link></li>


            <li className="nav-title">Vendor</li>
            <li><Link href="/vendors">Vendors<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/vendor-shop">Vendor Shop<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/become-vendor">Become A Vendor<i className="ti ti-arrow-right"></i></Link></li>

            <li className="nav-title">Cart & Checkout</li>
            <li><Link href="/cart">Cart<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/checkout">Checkout<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/checkout-bank">Checkout Bank<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/checkout-cash">Checkout Cash<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/checkout-credit-card">Checkout Credit Card<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/checkout-payment">Checkout Payment<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/checkout-paypal">Checkout PayPal<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/payment-success">Payment Success<i className="ti ti-arrow-right"></i></Link></li>

            <li className="nav-title">Authentication</li>
            <li><Link href="/login">Login<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/register">Register<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/otp">OTP Send<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/otp-confirm">OTP Confirmation<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/forget-password">Forget Password<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/change-password">Change Password<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/forget-password-success">Forget Password Success<i className="ti ti-arrow-right"></i></Link></li>


            <li className="nav-title">Blog</li>
            <li><Link href="/blog-grid">Blog Grid<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/blog-list">Blog List<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/blog-details">Blog Details<i className="ti ti-arrow-right"></i></Link></li>

            <li className="nav-title">Chat & Notifications</li>
            <li><Link href="/message">Message/Chat<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/notifications">Notifications<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/notification-details">Notifications Details<i className="ti ti-arrow-right"></i></Link></li>


            <li className="nav-title">Miscellaneous</li>
            <li><Link href="/profile">Profile<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/edit-profile">Edit Profile<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/about-us">About Us<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/contact">Contact Us<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/offline">Offline<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/language">Select Language<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/privacy-policy">Privacy Policy<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/settings">Settings<i className="ti ti-arrow-right"></i></Link></li>
            <li><Link href="/support">Support<i className="ti ti-arrow-right"></i></Link></li>
          </ul>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />

    </>
  );
};

export default Pages;