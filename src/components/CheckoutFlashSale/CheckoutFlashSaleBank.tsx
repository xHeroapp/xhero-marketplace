"use client";
import { ACCOUNT_NUMBER, BANK_NAME } from "@/constant/constant";
import { useClientReady } from "@/hooks/useClientReady";
import { useHandlePayment } from "@/hooks/useHandlePayment";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import { processFlashSaleOrder } from "@/services/processFlashSaleOrder.service";
import useCartStore from "@/store/cartStore";
import useCheckoutStore from "@/store/checkoutStore";
import useFlashSaleStore from "@/store/flashSaleStore";
import { generateTxRef } from "@/utils/generateTxRef";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const CheckoutFlashSaleBank = () => {
  const ready = useClientReady();
  const router = useRouter();

  // state
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txRef, setTxRef] = useState(generateTxRef());

  const { item, paymentMethod, clear, getTotal } = useFlashSaleStore();

  const orderAmount = getTotal();

  // Payment handler
  const handlePayment = () => {
    setIsLoading(true);
    const promise = processFlashSaleOrder({
      p_flash_sale_item_id: item.flash_sale_item_id,
      p_payment_method: paymentMethod,
      p_reference: txRef,
    });

    toast.promise(promise, {
      loading: "Processing flash deal...",
      success: () => {
        setIsSuccess(true);
        clear();
        router.push("/payment-success");
        return "Flash sale order successful 🎉";
      },
      error: (err) => {
        setIsSuccess(false);
        if (err.message) {
          return `${err.message}`;
        } else {
          return "Flash sale item may be sold out. Please try again.";
        }
      },
    });
  };

  if (!ready) return null;

  if (!item) return null;

  return (
    <>
      <HeaderTwo links="checkout-payment" title="Bank Info" />

      <div className="page-content-wrapper">
        <div className="container">
          <div className="checkout-wrapper-area py-3">
            <div className="credit-card-info-wrapper">
              <img
                className="d-block mb-4"
                src="/assets/img/bg-img/credit-card.png"
                alt=""
              />
              <div className="bank-ac-info">
                <p>
                  Make your payment directly into our bank account. Please use
                  your the tx-ref as the payment reference. Your order wont be
                  shipped until the payment has been verified.
                </p>
                <ul className="list-group mb-3">
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom">
                    Bank Name<span>{BANK_NAME}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                    Account Number<span>{ACCOUNT_NUMBER}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                    Tx-Ref<span>{txRef && txRef}</span>
                  </li>
                </ul>
              </div>
              <button
                disabled={isLoading || isSuccess}
                className="btn btn-primary btn-lg w-100"
                onClick={handlePayment}
              >
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />
    </>
  );
};

export default CheckoutFlashSaleBank;
