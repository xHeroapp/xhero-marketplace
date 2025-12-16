import React, { Suspense } from "react";
import Checkout from "@/components/Checkout";

export const metadata = {
  title: "Checkout",
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
        <Checkout />
      </Suspense>
    </>
  );
};

export default index;
