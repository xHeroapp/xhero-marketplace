import React, { Suspense } from "react";
import PaymentSuccess from "@/components/PaymentSuccess";

export const metadata = {
  title: "Payment Success",
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
        <PaymentSuccess />
      </Suspense>
    </>
  );
};

export default index;
