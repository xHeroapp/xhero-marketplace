"use client";

import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useCartStore from "@/store/cartStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAuthStore } from "@/store/authStore";
import { useClientReady } from "@/hooks/useClientReady";
import useCheckoutStore from "@/store/checkoutStore";
import { calculateCartDiscount } from "@/utils/calculateCartDiscount";

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

  // Get vendor cart data
  const vendorCart = vendorId ? cart[vendorId] : null;
  const items = vendorCart ? Object.values(vendorCart.items) : [];
  const vendor = vendorCart?.vendor;
  const vendor_delivery_fee = vendorCart?.vendor.delivery_fee || 0;
  const totalDiscount = calculateCartDiscount(items);
  const { subtotal, discount, deliveryFee, total } = getVendorTotal(vendorId);

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
      <HeaderTwo links="cart" title="Checkout" />

      <div className="checkout-page">
        {/* Progress Steps */}
        <div className="progress-header">
          <div className="progress-steps">
            <div
              className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
              onClick={() => setCurrentStep(1)}
            >
              <div className="step-number">
                {currentStep > 1 ? <i className="ti ti-check"></i> : '1'}
              </div>
              <span>Review</span>
            </div>
            <div className="step-line"></div>
            <div
              className={`step ${currentStep >= 2 ? 'active' : ''}`}
              onClick={() => currentStep >= 1 && setCurrentStep(2)}
            >
              <div className="step-number">2</div>
              <span>Pay</span>
            </div>
          </div>
        </div>

        <div className="checkout-content">
          {/* Step 1: Review Order */}
          {currentStep === 1 && (
            <div className="step-content">
              {/* Vendor Section */}
              <div className="section-card">
                <div className="vendor-header">
                  <div className="vendor-avatar">
                    {vendor.vendor_img ? (
                      <img src={vendor.vendor_img} alt={vendor.vendor_name} />
                    ) : (
                      <i className="ti ti-building-store"></i>
                    )}
                  </div>
                  <div className="vendor-info">
                    <h3>{vendor.vendor_name}</h3>
                    <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="items-list">
                  {items.map((product, index) => (
                    <div key={product.product_id} className="item-row">
                      <div className="item-image">
                        <img
                          src={product.image_url || "/assets/img/product/product_fallback.png"}
                          alt={product.product_name}
                        />
                      </div>
                      <div className="item-details">
                        <h4>{product.product_name}</h4>
                        <span className="item-price">{formatCurrency(product.price)}</span>
                      </div>
                      <div className="item-quantity">
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
              </div>

              {/* Order Summary */}
              <div className="section-card summary-card">
                <h3>Order Summary</h3>
                <div className="summary-rows">
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
              </div>

              {/* Continue Button */}
              <button
                className="continue-btn"
                onClick={() => setCurrentStep(2)}
              >
                Continue to Payment
                <i className="ti ti-arrow-right"></i>
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {currentStep === 2 && (
            <div className="step-content">
              {/* Delivery Address */}
              <div className="section-card">
                <div className="section-header">
                  <h3>Delivery Address</h3>
                  <Link href="/edit-profile" className="edit-link">Edit</Link>
                </div>
                <div className="address-card">
                  <div className="address-icon">
                    <i className="ti ti-map-pin"></i>
                  </div>
                  <div className="address-details">
                    <h4>{user?.full_name}</h4>
                    <p>{user?.delivery_address || "No address added"}</p>
                    {user?.phone && <span>{user.phone}</span>}
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="section-card">
                <div className="section-header">
                  <h3>Contact</h3>
                </div>
                <div className="contact-info">
                  <div className="info-row">
                    <i className="ti ti-mail"></i>
                    <span>{user?.email}</span>
                  </div>
                  {user?.phone && (
                    <div className="info-row">
                      <i className="ti ti-phone"></i>
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Method */}
              <div className="section-card">
                <div className="section-header">
                  <h3>Shipping</h3>
                </div>
                <label className="shipping-option selected">
                  <input type="radio" name="shipping" defaultChecked />
                  <div className="option-content">
                    <div className="option-icon">
                      <i className="ti ti-truck"></i>
                    </div>
                    <div className="option-details">
                      <span className="option-name">Standard Delivery</span>
                      <span className="option-desc">2-5 business days</span>
                    </div>
                    <span className="option-price">{formatCurrency(vendor_delivery_fee)}</span>
                  </div>
                </label>
              </div>

              {/* Payment Summary */}
              <div className="section-card summary-card">
                <div className="summary-rows">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="summary-row">
                    <span>Delivery</span>
                    <span>{formatCurrency(vendor_delivery_fee)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              {user?.delivery_address ? (
                <button className="pay-btn" onClick={handleCheckOut}>
                  Pay {formatCurrency(total)}
                </button>
              ) : (
                <div className="no-address-warning">
                  <i className="ti ti-alert-circle"></i>
                  <span>Please add a delivery address to continue</span>
                  <Link href="/edit-profile" className="add-address-btn">
                    Add Address
                  </Link>
                </div>
              )}

              {/* Back Button */}
              <button
                className="back-btn"
                onClick={() => setCurrentStep(1)}
              >
                <i className="ti ti-arrow-left"></i>
                Back to Review
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .loading-state {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid #e5e7eb;
          border-top-color: #0071e3;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .checkout-page {
          background: #f5f5f7;
          min-height: calc(100vh - 120px);
          padding-top: 60px;
          padding-bottom: 32px;
        }

        /* Progress Header */
        .progress-header {
          background: #ffffff;
          padding: 20px 16px;
          margin-bottom: 16px;
        }

        .progress-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          max-width: 280px;
          margin: 0 auto;
        }

        .step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          opacity: 0.4;
          transition: opacity 0.2s ease;
        }

        .step.active {
          opacity: 1;
        }

        .step-number {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #e5e7eb;
          color: #6b7280;
          font-size: 14px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .step.active .step-number {
          background: #0071e3;
          color: #fff;
        }

        .step.completed .step-number {
          background: #34c759;
          color: #fff;
        }

        .step span {
          font-size: 12px;
          font-weight: 500;
          color: #6b7280;
        }

        .step.active span {
          color: #1d1d1f;
        }

        .step-line {
          width: 60px;
          height: 2px;
          background: #e5e7eb;
          margin: 0 12px;
          margin-bottom: 24px;
        }

        /* Content */
        .checkout-content {
          padding: 0 16px;
          max-width: 680px;
          margin: 0 auto;
        }

        .step-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Section Cards */
        .section-card {
          background: #ffffff;
          border-radius: 16px;
          padding: 20px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .section-header h3 {
          font-size: 17px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0;
        }

        .edit-link {
          font-size: 15px;
          color: #0071e3;
          text-decoration: none;
          font-weight: 500;
        }

        /* Vendor Header */
        .vendor-header {
          display: flex;
          align-items: center;
          gap: 14px;
          padding-bottom: 16px;
          border-bottom: 1px solid #f5f5f7;
          margin-bottom: 16px;
        }

        .vendor-avatar {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .vendor-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vendor-avatar i {
          font-size: 22px;
          color: #fff;
        }

        .vendor-info h3 {
          font-size: 17px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0 0 2px;
        }

        .vendor-info span {
          font-size: 13px;
          color: #86868b;
        }

        /* Items List */
        .items-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .item-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .item-image {
          width: 64px;
          height: 64px;
          border-radius: 12px;
          background: #f5f5f7;
          overflow: hidden;
          flex-shrink: 0;
        }

        .item-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-details {
          flex: 1;
          min-width: 0;
        }

        .item-details h4 {
          font-size: 15px;
          font-weight: 500;
          color: #1d1d1f;
          margin: 0 0 4px;
          line-height: 1.3;
        }

        .item-price {
          font-size: 14px;
          color: #86868b;
        }

        .item-quantity {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #f5f5f7;
          border-radius: 10px;
          padding: 4px;
        }

        .qty-btn {
          width: 28px;
          height: 28px;
          border: none;
          background: transparent;
          color: #0071e3;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.15s ease;
        }

        .qty-btn:hover {
          background: rgba(0, 113, 227, 0.1);
        }

        .item-quantity span {
          min-width: 20px;
          text-align: center;
          font-size: 14px;
          font-weight: 600;
          color: #1d1d1f;
        }

        /* Summary Card */
        .summary-card h3 {
          font-size: 17px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0 0 16px;
        }

        .summary-rows {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 15px;
          color: #1d1d1f;
        }

        .summary-row.discount span:last-child {
          color: #34c759;
        }

        .summary-row.total {
          padding-top: 12px;
          border-top: 1px solid #f5f5f7;
          font-size: 17px;
          font-weight: 600;
        }

        /* Buttons */
        .continue-btn, .pay-btn {
          width: 100%;
          padding: 18px;
          background: #0071e3;
          color: #fff;
          font-size: 17px;
          font-weight: 500;
          border: none;
          border-radius: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
        }

        .continue-btn:hover, .pay-btn:hover {
          background: #0077ed;
          transform: translateY(-1px);
        }

        .back-btn {
          width: 100%;
          padding: 14px;
          background: transparent;
          color: #0071e3;
          font-size: 15px;
          font-weight: 500;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .back-btn:hover {
          color: #0077ed;
        }

        /* Address Card */
        .address-card {
          display: flex;
          gap: 14px;
          align-items: flex-start;
        }

        .address-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #f5f5f7;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .address-icon i {
          font-size: 20px;
          color: #0071e3;
        }

        .address-details h4 {
          font-size: 15px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0 0 4px;
        }

        .address-details p {
          font-size: 14px;
          color: #86868b;
          margin: 0 0 4px;
          line-height: 1.4;
        }

        .address-details span {
          font-size: 13px;
          color: #86868b;
        }

        /* Contact Info */
        .contact-info {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .info-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .info-row i {
          font-size: 18px;
          color: #86868b;
        }

        .info-row span {
          font-size: 15px;
          color: #1d1d1f;
        }

        /* Shipping Option */
        .shipping-option {
          display: block;
          cursor: pointer;
        }

        .shipping-option input {
          display: none;
        }

        .shipping-option .option-content {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 16px;
          background: #f5f5f7;
          border: 2px solid transparent;
          border-radius: 14px;
          transition: all 0.2s ease;
        }

        .shipping-option.selected .option-content,
        .shipping-option input:checked + .option-content {
          background: #f0fdf4;
          border-color: #34c759;
        }

        .option-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .option-icon i {
          font-size: 20px;
          color: #34c759;
        }

        .option-details {
          flex: 1;
        }

        .option-name {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: #1d1d1f;
          margin-bottom: 2px;
        }

        .option-desc {
          font-size: 13px;
          color: #86868b;
        }

        .option-price {
          font-size: 15px;
          font-weight: 600;
          color: #1d1d1f;
        }

        /* No Address Warning */
        .no-address-warning {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 24px;
          background: #fffbeb;
          border-radius: 14px;
          text-align: center;
        }

        .no-address-warning i {
          font-size: 32px;
          color: #f59e0b;
        }

        .no-address-warning span {
          font-size: 14px;
          color: #92400e;
        }

        .add-address-btn {
          padding: 12px 24px;
          background: #0071e3;
          color: #fff;
          font-size: 15px;
          font-weight: 500;
          border-radius: 980px;
          text-decoration: none;
        }

        /* Responsive */
        @media (max-width: 390px) {
          .item-image {
            width: 56px;
            height: 56px;
          }

          .item-details h4 {
            font-size: 14px;
          }

          .qty-btn {
            width: 24px;
            height: 24px;
          }
        }
      `}</style>
    </>
  );
};

export default Checkout;
