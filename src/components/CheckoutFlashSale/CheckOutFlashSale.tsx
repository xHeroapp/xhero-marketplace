"use client";

import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageWithFallback from "@/components/reuseable/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAuthStore } from "@/store/authStore";
import { useClientReady } from "@/hooks/useClientReady";
import useFlashSaleStore from "@/store/flashSaleStore";
import { generateTxRef } from "@/utils/generateTxRef";
import { toast } from "sonner";
import { processFlashSaleOrder } from "@/services/processFlashSaleOrder.service";
import { FLASH_SALE_ORDER_TYPE } from "@/constant/constant";

const CheckoutFlashSale = () => {
  const ready = useClientReady();
  const router = useRouter();
  const { user } = useAuthStore();
  const { item, getTotal } = useFlashSaleStore();

  const [txRef] = useState(generateTxRef());
  const [currentStep, setCurrentStep] = useState<"order" | "delivery">("order");
  useEffect(() => {
    console.log(item);
  }, [item]);

  const handleCheckout = () => {
    router.push(`/checkout-payment?order_type=${FLASH_SALE_ORDER_TYPE}`);

    // const promise = processFlashSaleOrder({
    //   p_flash_sale_item_id: item.flashSaleItemId,
    //   p_payment_method: paymentMethod,
    //   p_reference: txRef,
    // });

    // toast.promise(promise, {
    //   loading: "Processing flash deal...",
    //   success: () => {
    //     clear();
    //     router.push("/checkout-flash-sale-payment");
    //     return "Flash sale order successful 🎉";
    //   },
    //   error: () => "Flash sale item may be sold out. Please try again.",
    // });
  };

  if (!ready || !item) return null;

  return (
    <>
      <HeaderTwo links="cart" title="Flash Sale Checkout" />

      <div className="page-content-wrapper">
        <div className="container">
          <div className="checkout-wrapper-area py-3">
            {/* Steps */}
            <div className="card mb-3">
              <div className="card-body p-2 d-flex">
                <div className="flex-fill text-center">
                  <span
                    className={currentStep === "order" ? "fw-bold" : ""}
                    onClick={() => setCurrentStep("order")}
                  >
                    Deal
                  </span>
                </div>
                <div className="flex-fill text-center">
                  <span
                    className={currentStep === "delivery" ? "fw-bold" : ""}
                    onClick={() => setCurrentStep("delivery")}
                  >
                    Confirm
                  </span>
                </div>
              </div>
            </div>

            {/* Step 1: Order */}
            {currentStep === "order" && (
              <>
                <div className="card mb-3">
                  <div className="card-body d-flex align-items-center">
                    <ImageWithFallback
                      src={item.image_url}
                      alt={item.product_name}
                      width={60}
                      height={60}
                      className="me-3"
                    />
                    <div className="flex-grow-1">
                      <p className="mb-1 fw-medium">{item.product_name}</p>
                      <small className="text-danger">Flash Sale</small>
                    </div>
                    <h6>{formatCurrency(item.flash_price)}</h6>
                  </div>
                </div>

                <button
                  className="btn btn-primary w-100"
                  onClick={() => setCurrentStep("delivery")}
                >
                  Continue
                </button>
              </>
            )}

            {/* Step 2: Confirm */}
            {currentStep === "delivery" && (
              <>
                <div className="billing-information-card mb-3">
                  <div className="card user-data-card">
                    <div className="card-body">
                      <div className="single-profile-data d-flex align-items-center justify-content-between mb-3">
                        <span>Full Name</span>
                        <span>{user.full_name}</span>
                      </div>
                      <div className="single-profile-data d-flex align-items-center justify-content-between mb-3">
                        <span>Email</span>
                        <span>{user.email}</span>
                      </div>
                      <div className="single-profile-data d-flex align-items-center justify-content-between mb-3">
                        <span>Phone</span>
                        <span>{user.phone}</span>
                      </div>
                      <div className="single-profile-data d-flex align-items-center justify-content-between mb-3">
                        <span>Shipping:</span>
                        <span>
                          {user.delivery_address ?? "Add a delivery address"}
                        </span>
                      </div>
                      <Link
                        className="btn btn-primary w-100"
                        href="/edit-profile"
                      >
                        Edit Billing Information
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="card cart-amount-area">
                  <div className="card-body">
                    <div className="tp-cart-subtotal d-flex justify-content-between">
                      <h5>Subtotal</h5>
                      <h5>{formatCurrency(item.flash_price)}</h5>
                    </div>

                    <div className="shipping-method-choose mb-3 mt-3">
                      <div className="card shipping-method-card">
                        <div className="card-body">
                          {/* <h6 className="shipping-title mb-3">
                                              Shipping Method
                                            </h6> */}
                          <div className="shipping-options">
                            <label className="shipping-option">
                              <input
                                type="radio"
                                name="shipping"
                                defaultChecked
                                className="shipping-radio"
                              />
                              <div className="option-content">
                                <div className="option-icon">
                                  <i className="ti ti-truck"></i>
                                </div>
                                <div className="option-details">
                                  <span className="option-label">Delivery</span>
                                  <span className="option-price">
                                    {formatCurrency(item.delivery_fee)}
                                  </span>
                                </div>
                                <div className="option-check">
                                  <i className="ti ti-circle-check-filled"></i>
                                </div>
                              </div>
                            </label>

                            {/* Uncomment when pickup is available */}
                            {/* <label className="shipping-option disabled">
                        <input
                          type="radio"
                          name="shipping"
                          disabled
                          className="shipping-radio"
                        />
                        <div className="option-content">
                          <div className="option-icon">
                            <i className="ti ti-building-store"></i>
                          </div>
                          <div className="option-details">
                            <span className="option-label">Store Pickup</span>
                            <span className="option-price coming-soon">Coming Soon</span>
                          </div>
                          <div className="option-check">
                            <i className="ti ti-circle-check-filled"></i>
                          </div>
                        </div>
                      </label> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card">
                  <div className="card-body d-flex justify-content-between">
                    <h5>Total</h5>
                    <h5>{formatCurrency(getTotal())}</h5>
                  </div>

                  {user?.delivery_address && (
                    <div className="card-body">
                      <button
                        className="btn btn-success w-100"
                        onClick={handleCheckout}
                      >
                        Confirm & Buy
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />

      <style jsx>{`
        .progress-step {
          position: relative;
        }

        .step-indicator {
          font-size: 0.875rem;
        }

        .step-indicator span {
          display: block;
          margin-bottom: 8px;
          color: #6c757d;
        }

        .progress-step.active .step-indicator span {
          color: #198754;
          font-weight: 600;
        }

        .progress-bar {
          height: 4px;
          background-color: #e9ecef;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          width: 0;
          background-color: #198754;
          transition: width 0.3s ease;
        }

        .progress-fill.active {
          width: 100%;
        }

        .quantity-controls button {
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }

        .single-profile-data {
          padding: 10px 0;
          border-bottom: 1px solid #e9ecef;
        }

        .single-profile-data:last-of-type {
          border-bottom: none;
        }

        /* Updated Shipping Method Styles */
        .shipping-method-card {
          border-radius: 12px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .shipping-title {
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 16px;
        }

        .shipping-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .shipping-option {
          position: relative;
          cursor: pointer;
          margin: 0;
        }

        .shipping-option.disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }

        .shipping-radio {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .option-content {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: #f9fafb;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          transition: all 0.2s ease;
        }

        .shipping-option:hover .option-content {
          background: #f3f4f6;
          border-color: #d1d5db;
        }

        .shipping-radio:checked + .option-content {
          background: #f0fdf4;
          border-color: #10b981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        .option-icon {
          width: 40px;
          height: 40px;
          background: #ffffff;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        .option-icon i {
          font-size: 20px;
          color: #6b7280;
        }

        .shipping-radio:checked + .option-content .option-icon {
          background: #10b981;
        }

        .shipping-radio:checked + .option-content .option-icon i {
          color: #ffffff;
        }

        .option-details {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .option-label {
          font-size: 14px;
          font-weight: 600;
          color: #111827;
          line-height: 1.3;
        }

        .option-price {
          font-size: 13px;
          font-weight: 600;
          color: #10b981;
        }

        .option-price.coming-soon {
          color: #6b7280;
          font-weight: 500;
        }

        .option-check {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .option-check i {
          font-size: 24px;
          color: #d1d5db;
          transition: all 0.2s ease;
        }

        .shipping-radio:checked + .option-content .option-check i {
          color: #10b981;
        }

        @media (max-width: 576px) {
          .step-indicator span {
            font-size: 0.75rem;
          }

          .option-content {
            padding: 12px 14px;
          }

          .option-icon {
            width: 36px;
            height: 36px;
          }

          .option-icon i {
            font-size: 18px;
          }

          .option-label {
            font-size: 13px;
          }

          .option-price {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default CheckoutFlashSale;
