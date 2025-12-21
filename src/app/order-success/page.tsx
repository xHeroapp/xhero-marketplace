import React, { Suspense } from "react";
import OrderSuccess from "@/components/OrderSuccess";

export const metadata = {
  title: "Order Success",
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
        <OrderSuccess />
      </Suspense>
    </>
  );
};

export default index;
