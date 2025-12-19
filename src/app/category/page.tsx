import React, { Suspense } from "react";
import Category from "@/components/Category";

export const metadata = {
  title: "Category",
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
        <Category />
      </Suspense>
    </>
  );
};

export default index;
