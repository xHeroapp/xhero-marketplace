import CheckoutPayment from "@/components/CheckoutPayment";
import React, { Suspense } from "react";

export const metadata = {
  title: "Checkout Payment",
};

const index = () => {
  return (
    <>
      <Suspense
        fallback={
          <div className="login-wrapper d-flex align-items-center justify-content-center text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        }
      >
        <CheckoutPayment />
      </Suspense>
    </>
  );
};

export default index;
