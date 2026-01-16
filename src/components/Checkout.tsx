"use client";

import Footer from "@/layouts/Footer";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useCartStore from "@/store/cartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAuthStore } from "@/store/authStore";
import { useClientReady } from "@/hooks/useClientReady";
import useCheckoutStore from "@/store/checkoutStore";
import ImageWithFallback from "@/components/reuseable/ImageWithFallback";

const Checkout = () => {
  const ready = useClientReady();
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendor");

  const {
    cart,
    getVendorTotal,
    decrementQuantity,
    incrementQuantity,
    removeProductFromCart,
  } = useCartStore();

  const { startCheckout } = useCheckoutStore();
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [showItems, setShowItems] = useState(true);

  // Get vendor cart data
  const vendorCart = vendorId ? cart[vendorId] : null;
  const items = vendorCart ? Object.values(vendorCart.items) : [];
  const vendor = vendorCart?.vendor;
  const vendor_delivery_fee = vendorCart?.vendor.delivery_fee || 0;
  const { subtotal, discount, deliveryFee, total } = getVendorTotal(vendorId);
  const itemCount = items.reduce((sum, item: any) => sum + item.quantity, 0);

  useEffect(() => {
    if (!vendorCart) {
      router.push("/cart");
    }
  }, [vendorCart]);

  const handleCheckOut = () => {
    startCheckout(vendorId);
    router.push("/checkout-payment");
  };

  if (!ready) return null;

  if (!vendorCart || !vendor) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      {/* Custom Header */}
      <div className="checkout-header">
        <div className="header-row">
          <Link href="/cart" className="back-btn">
            <i className="ti ti-arrow-left"></i>
          </Link>
          <h1>Checkout</h1>
          <div className="header-spacer"></div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div className={`progress-item ${currentStep >= 1 ? 'active' : ''}`}>
            <span>Your Order</span>
          </div>
          <div className={`progress-item ${currentStep >= 2 ? 'active' : ''}`}>
            <span>Delivery & Payment</span>
          </div>
        </div>
        <div className="progress-lines">
          <div className={`progress-line ${currentStep >= 1 ? 'active' : ''}`}></div>
          <div className={`progress-line ${currentStep >= 2 ? 'active' : ''}`}></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="checkout-content">
        {currentStep === 1 && (
          <>
            {/* Order Summary Section */}
            <div className="section-header">
              <h2>Order Summary</h2>
            </div>

            {/* Vendor Card */}
            <div className="vendor-card">
              <div className="vendor-row">
                <div className="vendor-info">
                  <div className="vendor-logo">
                    {vendor.vendor_img ? (
                      <img src={vendor.vendor_img} alt={vendor.vendor_name} />
                    ) : (
                      <i className="ti ti-building-store"></i>
                    )}
                  </div>
                  <div className="vendor-details">
                    <h3>{vendor.vendor_name}</h3>
                    <span>{itemCount} Item{itemCount !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <button
                  className="toggle-btn"
                  onClick={() => setShowItems(!showItems)}
                >
                  {showItems ? 'Hide' : 'View'} Selection
                  <i className={`ti ti-chevron-${showItems ? 'up' : 'down'}`}></i>
                </button>
              </div>

              {/* Items List */}
              {showItems && (
                <div className="items-list">
                  {items.map((product: any) => (
                    <div key={product.product_id} className="item-row">
                      <div className="item-marker">★</div>
                      <div className="item-info">
                        <h4>{product.product_name}</h4>
                        <span className="item-price">{formatCurrency(product.price)}</span>
                      </div>
                      <div className="qty-controls">
                        <button
                          className="qty-btn"
                          onClick={() => decrementQuantity(vendorId!, product.product_id, user?.id)}
                        >
                          <i className="ti ti-minus"></i>
                        </button>
                        <span>{product.quantity}</span>
                        <button
                          className="qty-btn"
                          onClick={() => incrementQuantity(vendorId!, product.product_id, user?.id)}
                        >
                          <i className="ti ti-plus"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Continue Button */}
            <div className="checkout-footer">
              <p className="terms-text">
                By proceeding, you agree to our <Link href="/terms">Terms of Use</Link> and <Link href="/privacy">Privacy Policy</Link>
              </p>
              <button className="payment-btn" onClick={() => setCurrentStep(2)}>
                Continue
              </button>
            </div>
          </>
        )}

        {currentStep === 2 && (
          <>
            {/* Delivery Section */}
            <div className="section-header">
              <h2>Delivery & Payment</h2>
            </div>

            {/* Delivery Address */}
            <div className="delivery-card">
              <div className="card-header">
                <h3>Delivery Address</h3>
                <Link href="/edit-profile" className="edit-link">Edit</Link>
              </div>
              <div className="address-row">
                <i className="ti ti-map-pin"></i>
                <div className="address-text">
                  <strong>{user?.full_name}</strong>
                  <p>{user?.delivery_address || "No address added"}</p>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="summary-card">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Discount</span>
                  <span>-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Delivery</span>
                <span>{formatCurrency(vendor_delivery_fee)}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>

            {/* Make Payment Button */}
            <div className="checkout-footer">
              <p className="terms-text">
                By proceeding, you agree to our <Link href="/terms">Terms of Use</Link> and <Link href="/privacy">Privacy Policy</Link>
              </p>
              <button className="payment-btn" onClick={handleCheckOut}>
                Make Payment
              </button>
            </div>
          </>
        )}
      </div>

      <style jsx>{`
        /* Header */
        .checkout-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          z-index: 100;
        }

        .header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          max-width: 680px;
          margin: 0 auto;
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

        .header-row h1 {
          font-size: 18px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0;
        }

        .header-spacer {
          width: 32px;
        }

        /* Progress Bar */
        .progress-bar {
          display: flex;
          flex-direction: row;
          justify-content: flex-start;
          padding: 0 20px;
          max-width: 680px;
          margin: 0 auto 8px;
        }

        .progress-item {
          flex: 1;
        }

        .progress-item span {
          font-size: 14px;
          color: #86868b;
        }

        .progress-item.active span {
          color: #1d1d1f;
          font-weight: 500;
        }

        .progress-lines {
          display: flex;
          gap: 8px;
          padding: 0 20px 16px;
          max-width: 680px;
          margin: 0 auto;
        }

        .progress-line {
          flex: 1;
          height: 6px;
          background: #e5e7eb;
          border-radius: 3px;
        }

        .progress-line.active {
          background: #0071e3;
        }

        /* Content */
        .checkout-content {
          padding-top: 130px;
          min-height: calc(100vh - 60px);
          background: #f5f5f7;
          padding-bottom: 180px;
        }

        /* Section Header */
        .section-header {
          background: #f5f5f7;
          padding: 16px 20px;
        }

        .section-header h2 {
          font-size: 16px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0;
        }

        /* Vendor Card */
        .vendor-card {
          background: #ffffff;
          padding: 20px;
          margin: 0 16px 16px;
          border-radius: 8px;
        }

        .vendor-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .vendor-info {
          display: flex;
          gap: 12px;
        }

        .vendor-logo {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #f5f5f7;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .vendor-logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vendor-logo i {
          font-size: 20px;
          color: #86868b;
        }

        .vendor-details h3 {
          font-size: 16px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0 0 4px;
        }

        .vendor-details span {
          font-size: 13px;
          color: #86868b;
        }

        .toggle-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          background: none;
          border: none;
          color: #1d1d1f;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
        }

        .toggle-btn i {
          font-size: 14px;
        }

        /* Items List */
        .items-list {
          margin-top: 20px;
          border-top: 1px solid #e5e7eb;
          padding-top: 16px;
        }

        .item-row {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid #f5f5f7;
        }

        .item-row:last-child {
          border-bottom: none;
        }

        .item-marker {
          font-size: 12px;
          color: #1d1d1f;
          margin-top: 2px;
        }

        .item-info {
          flex: 1;
        }

        .item-info h4 {
          font-size: 15px;
          font-weight: 500;
          color: #1d1d1f;
          margin: 0 0 4px;
        }

        .item-price {
          font-size: 13px;
          color: #86868b;
        }

        .qty-controls {
          display: flex;
          align-items: center;
          background: #f5f5f7;
          border-radius: 8px;
        }

        .qty-btn {
          width: 36px;
          height: 36px;
          border: none;
          background: transparent;
          color: #1d1d1f;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .qty-controls span {
          min-width: 24px;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
        }

        /* Delivery Card */
        .delivery-card {
          background: #ffffff;
          padding: 20px;
          margin: 16px;
          border-radius: 8px;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .card-header h3 {
          font-size: 15px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0;
        }

        .edit-link {
          font-size: 14px;
          color: #0071e3;
          text-decoration: none;
        }

        .address-row {
          display: flex;
          gap: 12px;
        }

        .address-row i {
          font-size: 20px;
          color: #86868b;
          margin-top: 2px;
        }

        .address-text strong {
          font-size: 15px;
          color: #1d1d1f;
          display: block;
          margin-bottom: 4px;
        }

        .address-text p {
          font-size: 14px;
          color: #86868b;
          margin: 0;
          line-height: 1.4;
        }

        /* Summary Card */
        .summary-card {
          background: #ffffff;
          padding: 20px;
          margin: 16px;
          border-radius: 8px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          font-size: 14px;
          color: #1d1d1f;
        }

        .summary-row.discount span:last-child {
          color: #22c55e;
        }

        .summary-row.total {
          border-top: 1px solid #e5e7eb;
          margin-top: 8px;
          padding-top: 16px;
          font-weight: 600;
          font-size: 16px;
        }

        /* Footer */
        .checkout-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #ffffff;
          padding: 16px 20px;
        }

        .terms-text {
          font-size: 12px;
          color: #86868b;
          text-align: center;
          margin: 0 0 12px;
        }

        .terms-text :global(a) {
          color: #0071e3;
          text-decoration: none;
        }

        .payment-btn {
          width: 100%;
          padding: 14px;
          background: #0071e3;
          color: #ffffff;
          font-size: 15px;
          font-weight: 500;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .payment-btn:hover {
          background: #333333;
        }

        /* Loading State */
        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #f0f0f0;
          border-top-color: #0071e3;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default Checkout;
