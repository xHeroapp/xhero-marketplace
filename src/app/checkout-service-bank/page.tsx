import CheckoutServiceBank from "@/components/CheckoutService/CheckoutServiceBank";
import React, { Suspense } from "react";

export const metadata = {
  title: "Service Booking - Bank Transfer",
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
        <CheckoutServiceBank />
      </Suspense>
    </>
  );
};

export default index;

