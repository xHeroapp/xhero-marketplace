"use client";

import React, { useState, useEffect } from "react";
import Footer from "@/layouts/Footer";
import CartArea from "./common/CartArea";
import EmptyBag from "./common/EmptyBag";
import { ToastContainer } from "react-toastify";
import useCartStore from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import Link from "next/link";

const Cart = () => {
  const { cart, clearVendorCart, loadCart } = useCartStore();
  const { user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<"cart" | "ongoing" | "completed">("cart");
  const [showClearModal, setShowClearModal] = useState(false);

  // Handle hydration - wait for client-side to be ready
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Load cart from localStorage when user is available
  // This ensures cart persists across page refreshes
  useEffect(() => {
    if (user?.id) {
      loadCart(user.id);
    }
  }, [user?.id, loadCart]);

  const hasItems = Object.values(cart).length > 0;
  const vendorCarts = Object.entries(cart);

  const handleClearAll = () => {
    vendorCarts.forEach(([vendorId]) => clearVendorCart(vendorId, user?.id));
    setShowClearModal(false);
  };

  // Show loading skeleton during hydration to prevent FOUC
  if (!isHydrated) {
    return (
      <>
        <div className="orders-header">
          <div className="header-content">
            <div className="header-left">
              <div className="skeleton-back" />
              <div className="skeleton-title" />
            </div>
          </div>
          <div className="tab-bar-container">
            <div className="tab-bar">
              <div className="skeleton-tab" />
              <div className="skeleton-tab" />
              <div className="skeleton-tab" />
            </div>
          </div>
        </div>
        <div className="orders-content skeleton-content">
          <div className="skeleton-card" />
          <div className="skeleton-card" />
        </div>
        <Footer />
        <style jsx>{`
          .orders-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #ffffff;
            z-index: 100;
          }
          .header-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 16px 20px;
            max-width: 680px;
            margin: 0 auto;
          }
          .header-left {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          .skeleton-back {
            width: 32px;
            height: 32px;
            background: #f0f0f0;
            border-radius: 8px;
            animation: pulse 1.5s ease-in-out infinite;
          }
          .skeleton-title {
            width: 80px;
            height: 24px;
            background: #f0f0f0;
            border-radius: 6px;
            animation: pulse 1.5s ease-in-out infinite;
          }
          .tab-bar-container {
            padding: 16px 20px 20px;
            max-width: 680px;
            margin: 0 auto;
            border-bottom: 1px solid #f0f0f0;
          }
          .tab-bar {
            display: flex;
            background: #f0f0f0;
            border-radius: 12px;
            padding: 5px;
            gap: 4px;
          }
          .skeleton-tab {
            flex: 1;
            height: 44px;
            background: #e5e5e5;
            border-radius: 10px;
            animation: pulse 1.5s ease-in-out infinite;
          }
          .orders-content {
            padding-top: 160px;
            min-height: calc(100vh - 60px);
            background: #f5f5f7;
          }
          .skeleton-content {
            padding: 20px;
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .skeleton-card {
            height: 120px;
            background: #ffffff;
            border-radius: 16px;
            animation: pulse 1.5s ease-in-out infinite;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}</style>
      </>
    );
  }

  return (
    <>
      {/* Custom Header with Tab Bar */}
      <div className="orders-header">
        <div className="header-content">
          <div className="header-left">
            <Link href="/" className="back-btn">
              <i className="ti ti-arrow-left"></i>
            </Link>
            <h1>Orders</h1>
          </div>
          {hasItems && activeTab === "cart" && (
            <button className="clear-cart-btn" onClick={() => setShowClearModal(true)}>
              Clear Cart
            </button>
          )}
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

      {/* Clear Cart Modal */}
      {showClearModal && (
        <div className="modal-overlay" onClick={() => setShowClearModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">
              <i className="ti ti-trash"></i>
            </div>
            <h3>Clear Cart?</h3>
            <p>Are you sure you want to remove all items from your cart?</p>
            <div className="modal-actions">
              <button className="modal-btn cancel" onClick={() => setShowClearModal(false)}>
                Cancel
              </button>
              <button className="modal-btn confirm" onClick={handleClearAll}>
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      )}

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
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          max-width: 680px;
          margin: 0 auto;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .back-btn {
          width: 32px;
          height: 32px;
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
          padding: 16px 20px 20px;
          max-width: 680px;
          margin: 0 auto;
          border-bottom: 1px solid #f0f0f0;
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
          padding-top: 160px;
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

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal-content {
          background: #ffffff;
          border-radius: 20px;
          padding: 32px 24px;
          max-width: 320px;
          width: 100%;
          text-align: center;
        }

        .modal-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #fef2f2;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }

        .modal-icon i {
          font-size: 24px;
          color: #ef4444;
        }

        .modal-content h3 {
          font-size: 18px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0 0 8px;
        }

        .modal-content p {
          font-size: 14px;
          color: #86868b;
          margin: 0 0 24px;
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          gap: 12px;
        }

        .modal-btn {
          flex: 1;
          padding: 14px;
          border: none;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-btn.cancel {
          background: #f5f5f7;
          color: #1d1d1f;
        }

        .modal-btn.cancel:hover {
          background: #e5e7eb;
        }

        .modal-btn.confirm {
          background: #ef4444;
          color: #ffffff;
        }

        .modal-btn.confirm:hover {
          background: #dc2626;
        }
      `}</style>
    </>
  );
};

export default Cart;
