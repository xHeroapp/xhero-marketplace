"use client";
import { FLASH_SALE_ORDER_TYPE, SERVICE_ORDER_TYPE } from "@/constant/constant";
import useCheckoutStore from "@/store/checkoutStore";
import useFlashSaleStore from "@/store/flashSaleStore";
import useServiceStore from "@/store/serviceStore";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";

const CheckoutPayment = () => {
  const searchParams = useSearchParams();
  const order_type = searchParams.get("order_type");

  const setPaymentMethod = useCheckoutStore(
    (state: any) => state.setPaymentMethod
  );
  const setFlashSalePaymentMethod = useFlashSaleStore(
    (state: any) => state.setPaymentMethod
  );
  const setServicePaymentMethod = useServiceStore(
    (state) => state.setPaymentMethod
  );
  const router = useRouter();

  const handlePaymentMethod = (paymentMethod: string) => {
    if (order_type == FLASH_SALE_ORDER_TYPE) {
      setFlashSalePaymentMethod(paymentMethod);

      paymentMethod == "wallet"
        ? router.push("checkout-flash-sale-wallet")
        : router.push("checkout-flash-sale-bank");
    } else if (order_type == SERVICE_ORDER_TYPE) {
      setServicePaymentMethod(paymentMethod as "wallet" | "bank_transfer");

      paymentMethod == "wallet"
        ? router.push("checkout-service-wallet")
        : router.push("checkout-service-bank");
    } else {
      setPaymentMethod(paymentMethod);

      paymentMethod == "wallet"
        ? router.push("checkout-wallet")
        : router.push("checkout-bank");
    }
  };
  return (
    <>
      {/* Minimal header without hamburger menu - keeps users focused on payment selection */}
      <div className="header-area" id="headerArea">
        <div className="container h-100 d-flex align-items-center justify-content-between rtl-flex-d-row-r">
          <div className="back-button me-2">
            <div onClick={() => router.back()}>
              <i className="ti ti-arrow-left"></i>
            </div>
          </div>
          <div className="page-heading">
            <h6 className="mb-0">Choose Payment Method</h6>
          </div>
          {/* Hamburger menu removed to improve user journey */}
          <div style={{ width: '24px' }}></div>
        </div>
      </div>

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
                      onClick={() => handlePaymentMethod("bank_transfer")}
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
    </>
  );
};

export default CheckoutPayment;
