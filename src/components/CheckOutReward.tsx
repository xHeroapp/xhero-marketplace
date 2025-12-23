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
import useRewardCartStore from "@/store/rewardCartStore";
import { processOrder } from "@/services/processOrder.service";
import { generateTxRef } from "@/utils/generateTxRef";
import { toast } from "sonner";
import { processRewardOrder } from "@/services/processRewardOrder.service";

const CheckoutReward = () => {
  const ready = useClientReady();
  const router = useRouter();
  const { user } = useAuthStore();
  const { rewardCart, getItems, getTotal, clearRewardCart } =
    useRewardCartStore();

  const [txRef, setTxRef] = useState(generateTxRef());
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState<"order" | "delivery">("order");

  const items = getItems();
  const { subtotal, discount, deliveryFee, total } = getTotal();

  // useEffect(() => {
  //   if (!rewardCart) {
  //     router.push("/gifts"); // redirect if no reward selected
  //   }
  // }, [rewardCart]);

  const handleCheckOutReward = () => {
    try {
      const promise = processRewardOrder({
        p_reward_recognition_id: rewardCart.recognition_id,
        // p_items: Object.values(rewardCart.items),
        // p_payment_method: "REWARD_REDEM", //reward redemption
        p_reference: txRef,
      });

      toast.promise(promise, {
        loading: "Redeeming Reward...",

        success: () => {
          setIsLoading(false);
          setIsSuccess(true);
          router.push("/reward-success");
          clearRewardCart();

          return "Reward Redeemed Successfully";
        },

        error: () => {
          setIsLoading(false);
          setIsSuccess(false);
          return `There was an error while trying to process your. Please try again later`;
        },
      });
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }

    console.log(rewardCart);
  };

  if (!ready || !rewardCart) return null;

  const vendor = rewardCart.vendor;

  return (
    <>
      <HeaderTwo links="cart" title="Reward Checkout" />

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
                        <span>Your Reward</span>
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
                        <span>Delivery & Confirm</span>
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
              <div className="order-summary-section">
                <h5 className="mb-3">Reward Summary</h5>

                <div className="card mb-3">
                  <div className="card-body d-flex align-items-center">
                    {vendor.vendor_img ? (
                      <img
                        src={vendor.vendor_img}
                        alt={vendor.vendor_name}
                        width={40}
                        height={40}
                        className="rounded me-2"
                      />
                    ) : (
                      <div
                        className="bg-light rounded d-flex align-items-center justify-content-center me-2"
                        style={{ width: 40, height: 40 }}
                      >
                        <i className="ti ti-building-store"></i>
                      </div>
                    )}
                    <div>
                      <h6 className="mb-0">{vendor.vendor_name}</h6>
                      <small className="text-muted">
                        {items.length} Reward Item
                      </small>
                    </div>
                  </div>
                </div>

                {items.map((product, index) => (
                  <div key={product.product_id} className="card mb-3">
                    <div className="card-body d-flex align-items-center">
                      <ImageWithFallback
                        src={product.image_url}
                        alt={product.product_name}
                        width={60}
                        height={60}
                        className="rounded me-3"
                      />
                      <div className="flex-grow-1">
                        <p className="mb-1 fw-medium">{product.product_name}</p>
                        <small className="text-success">Reward Item</small>
                        {product.product_description && (
                          <p className="mb-0">{product.product_description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  className="btn btn-primary w-100"
                  onClick={() => setCurrentStep("delivery")}
                >
                  Continue
                </button>
              </div>
            )}

            {/* Delivery & Confirm Step */}
            {currentStep === "delivery" && (
              <div className="delivery-payment-section">
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

                <div className="card cart-amount-area">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <h5>Total</h5>
                    <h5>{formatCurrency(total)}</h5>
                  </div>
                  {user.delivery_address && (
                    <div className="card-body mt-2">
                      <button
                        className="btn btn-success w-100"
                        onClick={handleCheckOutReward}
                      >
                        Confirm & Redeem Reward
                      </button>
                    </div>
                  )}
                  {!user.delivery_address && (
                    <div className="card-body mt-2">
                      <p>Add a delivery address to continue</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default CheckoutReward;
