"use client";
import { useAuthStore } from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

const OrderSuccess = () => {
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendor_id");
  const { user } = useAuthStore();
  const { clearVendorCart } = useCartStore();

  useEffect(() => {
    if (vendorId) {
      clearVendorCart(vendorId, user?.id);
    }
  }, [vendorId]);

  return (
    <>
      <div className="order-success-wrapper">
        <div className="content">
          <div className="display-1 text-white mb-2">
            <i className="ti ti-circle-check"></i>
          </div>
          <h5 className="text-white">Order successful</h5>
          <p className="text-white opacity-75">
            Your order was successful and your payment is pending verification,
            We will notify you of all the details via email. Thank you!
          </p>
          <Link className="btn btn-primary mt-3" href="/home">
            <i className="ti ti-arrow-left pe-2"></i>Shopping Again
          </Link>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
