"use client";
import { useClientReady } from "@/hooks/useClientReady";
import { useHandlePayment } from "@/hooks/useHandlePayment";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import useCartStore from "@/store/cartStore";
import useCheckoutStore from "@/store/checkoutStore";
import { generateTxRef } from "@/utils/generateTxRef";
import React, { useState } from "react";

const CheckoutBank = () => {
  const ready = useClientReady();

  // state
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txRef, setTxRef] = useState(generateTxRef());

  const { getVendorTotal } = useCartStore();
  const { getVendorCart } = useCheckoutStore();
  const vendorCart = getVendorCart();

  const orderAmount = getVendorTotal(vendorCart && vendorCart.vendor.vendor_id);

  // Payment handler
  const { handlePayment } = useHandlePayment({
    orderAmount,
    vendorCart,
    setIsLoading,
    setIsSuccess,
    payment_method: "bank_transfer",
    redirect_link: `/order-success?vendor_id=${
      vendorCart && vendorCart.vendor.vendor_id
    }`,
    TX_REF: txRef,
  });

  if (!ready) return null;

  if (!vendorCart) return null;

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
                    Bank Name<span>Example Bank Ltd.</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                    Account Number<span>010 2125 32563 2525</span>
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

export default CheckoutBank;
