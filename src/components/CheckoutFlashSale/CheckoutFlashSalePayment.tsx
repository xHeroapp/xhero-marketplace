"use client";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import useFlashSaleStore from "@/store/flashSaleStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const CheckoutFlashSalePayment = () => {
  const { setPaymentMethod } = useFlashSaleStore();
  const router = useRouter();

  const handlePaymentMethod = (paymentMethod: string) => {
    setPaymentMethod(paymentMethod);

    paymentMethod == "wallet"
      ? router.push("checkout-flash-sale-wallet")
      : router.push("checkout-flash-sale-bank");
  };
  return (
    <>
      <HeaderTwo links="checkout" title="Choose Payment Method" />

      <div className="page-content-wrapper">
        <div className="container">
          <div className="checkout-wrapper-area py-3">
            <div className="choose-payment-method">
              <div className="row g-2 justify-content-center rtl-flex-d-row-r">
                {/* <!-- Single Payment Method--> */}
                <div className="col-6 col-md-5">
                  <div className="single-payment-method">
                    <div
                      className="credit-card"
                      onClick={() => handlePaymentMethod("wallet")}
                    >
                      <i className="ti ti-wallet"></i>
                      <h6>Wallet</h6>
                    </div>
                  </div>
                </div>
                {/* <!-- Single Payment Method--> */}
                <div className="col-6 col-md-5">
                  <div className="single-payment-method">
                    <div
                      className="bank"
                      onClick={() => handlePaymentMethod("bank-transfer")}
                    >
                      <i className="ti ti-building"></i>
                      <h6>Bank Transfer</h6>
                    </div>
                  </div>
                </div>
                {/* <!-- Single Payment Method--> */}
                {/* <div className="col-6 col-md-5">
                  <div className="single-payment-method">
                    <Link className="paypal" href="/checkout-paypal">
                      <i className="ti ti-brand-paypal"></i>
                      <h6>PayPal</h6>
                    </Link>
                  </div>
                </div> */}
                {/* <!-- Single Payment Method--> */}
                {/* <div className="col-6 col-md-5">
                  <div className="single-payment-method">
                    <Link className="cash" href="/checkout-cash">
                      <i className="ti ti-shield-dollar"></i>
                      <h6>Cash On Delivary</h6>
                    </Link>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />
    </>
  );
};

export default CheckoutFlashSalePayment;
