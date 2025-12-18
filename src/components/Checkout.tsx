"use client";

import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useCartStore from "@/store/cartStore";
import ImageWithFallback from "@/components/reuseable/ImageWithFallback";
import { formatCurrency } from "@/utils/formatCurrency";
import { useAuthStore } from "@/store/authStore";
import { useClientReady } from "@/hooks/useClientReady";
import useCheckoutStore from "@/store/checkoutStore";

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

  //   router
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<"order" | "delivery">("order");

  // Get vendor cart data
  const vendorCart = vendorId ? cart[vendorId] : null;
  const items = vendorCart ? Object.values(vendorCart.items) : [];
  const vendor = vendorCart?.vendor;
  const total = vendorId ? getVendorTotal(vendorId) : 0;

  useEffect(() => {
    if (!vendorCart) {
      // Redirect back to cart if vendor not found
      router.push("/cart");
    }
  }, [vendorCart]);

  const handleCheckOut = () => {
    startCheckout(vendorId); // pass in delivery fee and discount later
    router.push("/checkout-payment");
  };

  if (!ready) return null;

  if (!vendorCart || !vendor) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeaderTwo links="cart" title="Checkout" />

      <div className="page-content-wrapper">
        <div className="container">
          <div className="checkout-wrapper-area py-3">
            {/* Progress tabs */}
            <div className="card mb-3">
              <div className="card-body p-2">
                <div className="d-flex">
                  <div className="flex-fill text-center">
                    <div
                      className={`progress-step ${
                        currentStep === "order" ? "active" : ""
                      }`}
                    >
                      <div
                        className="step-indicator"
                        onClick={() => setCurrentStep("order")}
                      >
                        <span>Your Order</span>
                        <div className="progress-bar">
                          <div
                            className={`progress-fill ${
                              currentStep === "order" ? "active" : ""
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-fill text-center">
                    <div
                      className={`progress-step ${
                        currentStep === "delivery" ? "active" : ""
                      }`}
                    >
                      <div
                        className="step-indicator"
                        onClick={() => setCurrentStep("delivery")}
                      >
                        <span>Delivery & Payment</span>
                        <div className="progress-bar">
                          <div
                            className={`progress-fill ${
                              currentStep === "delivery" ? "active" : ""
                            }`}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Step */}
            {currentStep === "order" && (
              <>
                <div className="order-summary-section">
                  <h5 className="mb-3">Order Summary</h5>

                  {/* Vendor info */}
                  <div className="card mb-3">
                    <div className="card-body">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <div className="d-flex align-items-center">
                          <div className="vendor-icon me-2">
                            {vendor.vendor_img ? (
                              <img
                                src={vendor.vendor_img}
                                alt={vendor.vendor_name}
                                width="40"
                                height="40"
                                className="rounded"
                              />
                            ) : (
                              <div
                                className="bg-light rounded d-flex align-items-center justify-content-center"
                                style={{ width: 40, height: 40 }}
                              >
                                <i className="ti ti-building-store"></i>
                              </div>
                            )}
                          </div>
                          <div>
                            <h6 className="mb-0">{vendor.vendor_name}</h6>
                            <small className="text-muted">
                              {items.length} Items
                            </small>
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-link"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#orderItems"
                        >
                          Hide Selection
                          <i className="ti ti-chevron-up ms-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Order items - Collapsible */}
                  <div className="collapse show" id="orderItems">
                    {items.map((product, index) => (
                      <div key={product.product_id} className="card mb-3">
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <h6 className="mb-0">Item {index + 1}</h6>
                            <div>
                              {/* removed copy button */}
                              {/* <button
                                className="btn btn-sm btn-link text-dark p-1 me-2"
                                title="Duplicate"
                              >
                                <i className="ti ti-copy"></i>
                              </button> */}
                              <button
                                className="btn btn-sm btn-link text-danger p-1"
                                onClick={() =>
                                  removeProductFromCart(
                                    vendorId!,
                                    product.product_id,
                                    user?.id
                                  )
                                }
                              >
                                <i className="ti ti-trash"></i>
                              </button>
                            </div>
                          </div>

                          <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center flex-grow-1">
                              <ImageWithFallback
                                src={product.image_url}
                                alt={product.product_name}
                                width={60}
                                height={60}
                                className="rounded me-3"
                              />
                              <div className="flex-grow-1">
                                <p className="mb-1 fw-medium">
                                  {product.product_name}
                                </p>
                                <small className="text-muted">
                                  {formatCurrency(product.price)}
                                </small>
                              </div>
                            </div>

                            {/* Quantity controls */}
                            <div className="quantity-controls d-flex align-items-center">
                              <button
                                className="btn btn-sm btn-outline-secondary rounded-circle"
                                style={{ width: 32, height: 32, padding: 0 }}
                                onClick={() =>
                                  decrementQuantity(
                                    vendorId,
                                    product.product_id,
                                    user?.id
                                  )
                                }
                              >
                                -
                              </button>
                              <span className="mx-3 fw-medium">
                                {product.quantity}
                              </span>
                              <button
                                className="btn btn-sm btn-outline-secondary rounded-circle"
                                style={{ width: 32, height: 32, padding: 0 }}
                                onClick={() =>
                                  incrementQuantity(
                                    vendorId!,
                                    product.product_id,
                                    user?.id
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>

                          {/* Product customizations - if any */}
                          {product.customizations && (
                            <div className="mt-3 p-2 bg-light rounded">
                              <div className="d-flex justify-content-between align-items-center">
                                <div>
                                  <small className="fw-medium">
                                    Your Selections
                                  </small>
                                  <br />
                                  <small className="text-muted">
                                    {product.customizations}
                                  </small>
                                </div>
                                <small className="text-success">
                                  +{" "}
                                  {formatCurrency(
                                    product.customizationPrice || 0
                                  )}
                                </small>
                              </div>
                              <button className="btn btn-sm btn-success w-100 mt-2">
                                Edit Selections →
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Make payment button */}
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => setCurrentStep("delivery")}
                  >
                    Make Payment
                  </button>
                </div>
              </>
            )}

            {/* Delivery & Payment Step */}
            {currentStep === "delivery" && (
              <>
                <div className="delivery-payment-section">
                  {/* Billing Information */}
                  <div className="billing-information-card mb-3">
                    <div className="card billing-information-title-card mb-2">
                      <div className="card-body">
                        <h6 className="text-center mb-0">
                          Billing Information
                        </h6>
                      </div>
                    </div>
                    <div className="card user-data-card">
                      <div className="card-body">
                        <div className="single-profile-data d-flex align-items-center justify-content-between mb-3">
                          <div className="title d-flex align-items-center">
                            <i className="ti ti-user me-2"></i>
                            <span>Full Name</span>
                          </div>
                          <div className="data-content">{user.full_name}</div>
                        </div>
                        <div className="single-profile-data d-flex align-items-center justify-content-between mb-3">
                          <div className="title d-flex align-items-center">
                            <i className="ti ti-mail me-2"></i>
                            <span>Email Address</span>
                          </div>
                          <div className="data-content">{user?.email}</div>
                        </div>
                        <div className="single-profile-data d-flex align-items-center justify-content-between mb-3">
                          <div className="title d-flex align-items-center">
                            <i className="ti ti-phone me-2"></i>
                            <span>Phone</span>
                          </div>
                          <div className="data-content">{user?.phone}</div>
                        </div>
                        <div className="single-profile-data d-flex align-items-center justify-content-between mb-3">
                          <div className="title d-flex align-items-center">
                            <i className="ti ti-map-pin me-2"></i>
                            <span>Shipping:</span>
                          </div>
                          <div className="data-content">
                            {user?.delivery_address
                              ? user?.delivery_address
                              : "Add a delivery address"}
                          </div>
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
                        <h5>{formatCurrency(total)}</h5>
                      </div>

                      <div className="shipping-method-choose mb-3">
                        <div className="card shipping-method-choose-title-card">
                          <div className="card-body">
                            <h6 className="text-center mb-0">
                              Shipping Method
                            </h6>
                          </div>
                        </div>
                        <div className="card shipping-method-choose-card">
                          <div
                            className="card-body"
                            style={{ paddingLeft: "0" }}
                          >
                            <div className="shipping-method-choose">
                              <ul className="ps-0">
                                <li>
                                  <input
                                    id="delivery"
                                    type="radio"
                                    name="shipping"
                                    defaultChecked
                                  />
                                  <label
                                    htmlFor="delivery"
                                    //   onClick={() => handleShippingCost(20)}
                                  >
                                    Delivery:{" "}
                                    <span>{formatCurrency(2000)}</span>
                                  </label>

                                  <div className="check"></div>
                                </li>
                                {/* <li className="disabled">
                                  <input
                                    id="pickup"
                                    type="radio"
                                    name="shipping"
                                    disabled
                                  />
                                  <label
                                    htmlFor="pickup"
                                    //   onClick={() => handleShippingCost(25)}
                                  >
                                    Pickup <span>Coming Soon</span>
                                  </label>
                                  <div className="check"></div>
                                </li> */}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="tp-cart-subtotal d-flex justify-content-between">
                        <h5>Total</h5>
                        <h5>{formatCurrency(total)}</h5>
                        {/* <h5>$ {total + shipCost}</h5> */}
                      </div>
                    </div>
                  </div>

                  {/* Total and confirm */}
                  <div className="card cart-amount-area">
                    {user?.delivery_address ? (
                      <div className="card-body d-flex align-items-center justify-content-between">
                        <h5 className="total-price mb-0">
                          {formatCurrency(total)}
                        </h5>
                        <button
                          className="btn btn-primary"
                          onClick={handleCheckOut}
                        >
                          Confirm & Pay
                        </button>
                      </div>
                    ) : (
                      <div className="card-body d-flex align-items-center justify-content-between">
                        <p>Add a delivery address to continue</p>
                      </div>
                    )}
                  </div>

                  {/* Back button */}
                  <button
                    className="btn btn-link w-100 mt-2"
                    onClick={() => setCurrentStep("order")}
                  >
                    Back to Order Summary
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

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

        .shipping-method-choose ul {
          list-style: none;
        }

        .shipping-method-choose li {
          position: relative;
          padding-left: 35px;
        }

        .shipping-method-choose input[type="radio"] {
          position: absolute;
          left: 0;
          top: 2px;
        }

        .shipping-method-choose label {
          display: block;
          cursor: pointer;
          font-weight: 500;
        }

        .shipping-method-choose label span {
          display: block;
          font-size: 0.875rem;
          color: #6c757d;
          font-weight: 400;
        }

        @media (max-width: 576px) {
          .step-indicator span {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </>
  );
};

export default Checkout;
