import React, { Suspense } from "react";
import NotificationDetails from "@/components/NotificationDetails";

export const metadata = {
  title: "Notification",
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
        <NotificationDetails />
      </Suspense>
    </>
  );
};

export default index;
