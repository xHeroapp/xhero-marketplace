"use client";

import React, { useState } from "react";
import Footer from "@/layouts/Footer";
import CartArea from "./common/CartArea";
import EmptyBag from "./common/EmptyBag";
import { ToastContainer } from "react-toastify";
import useCartStore from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const Cart = () => {
  const { cart, clearVendorCart } = useCartStore();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"cart" | "ongoing" | "completed">("cart");

  const hasItems = Object.values(cart).length > 0;
  const vendorCarts = Object.entries(cart);

  const handleClearAll = () => {
    if (confirm("Clear entire cart?")) {
      vendorCarts.forEach(([vendorId]) => clearVendorCart(vendorId, user?.id));
    }
  };

  return (
    <>
      {/* Custom Header */}
      <div className="orders-header">
        <div className="header-content">
          <Link href="/" className="back-btn">
            <i className="ti ti-arrow-left"></i>
          </Link>
          <h1>Orders</h1>
          {hasItems && activeTab === "cart" && (
            <button className="clear-cart-btn" onClick={handleClearAll}>
              Clear Cart
            </button>
          )}
        </div>
      </div>

      {/* Tab Bar */}
      <div className="tab-bar-container">
        <div className="tab-bar">
          <button
            className={`tab ${activeTab === "cart" ? "active" : ""}`}
            onClick={() => setActiveTab("cart")}
          >
            My Cart
          </button>
          <button
            className={`tab ${activeTab === "ongoing" ? "active" : ""}`}
            onClick={() => setActiveTab("ongoing")}
          >
            Ongoing
          </button>
          <button
            className={`tab ${activeTab === "completed" ? "active" : ""}`}
            onClick={() => setActiveTab("completed")}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="orders-content">
        {activeTab === "cart" && (
          <>
            {hasItems ? <CartArea /> : <EmptyBag />}
          </>
        )}
        {activeTab === "ongoing" && (
          <div className="empty-tab-state">
            <i className="ti ti-package"></i>
            <h3>No ongoing orders</h3>
            <p>Orders you've placed will appear here</p>
          </div>
        )}
        {activeTab === "completed" && (
          <div className="empty-tab-state">
            <i className="ti ti-circle-check"></i>
            <h3>No completed orders</h3>
            <p>Your order history will appear here</p>
          </div>
        )}
      </div>

      <Footer />
      <ToastContainer position="top-right" />

      <style jsx>{`
        .orders-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          z-index: 100;
          border-bottom: 1px solid #f0f0f0;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          max-width: 680px;
          margin: 0 auto;
        }

        .back-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1d1d1f;
          text-decoration: none;
          font-size: 20px;
        }

        .header-content h1 {
          font-size: 18px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }

        .clear-cart-btn {
          background: rgba(0, 113, 227, 0.1);
          border: none;
          color: #0071e3;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          padding: 8px 16px;
          border-radius: 20px;
        }

        .clear-cart-btn:hover {
          background: rgba(0, 113, 227, 0.15);
        }

        /* Tab Bar */
        .tab-bar-container {
          position: fixed;
          top: 73px;
          left: 0;
          right: 0;
          background: #ffffff;
          z-index: 99;
          padding: 12px 20px 16px;
        }

        .tab-bar {
          display: flex;
          background: #f0f0f0;
          border-radius: 12px;
          padding: 5px;
          max-width: 680px;
          margin: 0 auto;
        }

        .tab {
          flex: 1;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #86868b;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .tab.active {
          background: #0071e3;
          color: #ffffff;
        }

        .tab:not(.active):hover {
          color: #1d1d1f;
        }

        /* Content */
        .orders-content {
          padding-top: 140px;
          min-height: calc(100vh - 60px);
          background: #f5f5f7;
        }

        /* Empty Tab State */
        .empty-tab-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          text-align: center;
        }

        .empty-tab-state i {
          font-size: 48px;
          color: #d1d1d6;
          margin-bottom: 16px;
        }

        .empty-tab-state h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0 0 8px;
        }

        .empty-tab-state p {
          font-size: 14px;
          color: #86868b;
          margin: 0;
        }
      `}</style>
    </>
  );
};

export default Cart;
