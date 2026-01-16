"use client";
import { ACCOUNT_NUMBER, BANK_NAME } from "@/constant/constant";
import { useClientReady } from "@/hooks/useClientReady";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import { processServiceOrder } from "@/services/processServiceOrder.service";
import useServiceStore from "@/store/serviceStore";
import { generateTxRef } from "@/utils/generateTxRef";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";

const CheckoutServiceBank = () => {
  const ready = useClientReady();
  const router = useRouter();

  // state
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [txRef, setTxRef] = useState(generateTxRef());

  const { booking, paymentMethod, clearBooking, getTotal } = useServiceStore();
  const userId = useAuthStore((state) => state.user?.id);

  const orderAmount = getTotal();

  // Calculate duration in minutes from start_time and end_time
  const calculateDuration = (
    startTime: string,
    endTime: string
  ): number | null => {
    if (!startTime || !endTime) return null;

    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startTotalMinutes = startHours * 60 + startMinutes;
    const endTotalMinutes = endHours * 60 + endMinutes;

    return endTotalMinutes - startTotalMinutes;
  };

  // Payment handler
  const handlePayment = () => {
    if (!booking || !userId) {
      toast.error("Booking information not found");
      return;
    }

    const durationMinutes = calculateDuration(
      booking.booking_details.start_time,
      booking.booking_details.end_time
    );

    setIsLoading(true);
    const promise = processServiceOrder({
      p_vendor_product_id: booking.service.vendor_product_id,
      p_service_mode: booking.booking_details.service_mode,
      p_start_date: booking.booking_details.start_date,
      p_payment_method: paymentMethod || "bank_transfer",
      // p_end_date: booking.booking_details.end_date || null, we are only using one time service for now, so no end date is needed
      p_start_time: booking.booking_details.start_time || null,
      // p_duration_minutes: durationMinutes, we are only using one time service for now, so no duration is needed
      p_note: booking.booking_details.note || null,
      p_reference: txRef || null,
    });

    toast.promise(promise, {
      loading: "Processing service booking...",
      success: () => {
        setIsSuccess(true);
        clearBooking(userId);
        router.push("/payment-success");
        return "Service booking successful 🎉";
      },
      error: (err) => {
        setIsSuccess(false);
        if (err.message) {
          return `${err.message}`;
        } else {
          return "Service booking failed. Please try again.";
        }
      },
    });
  };

  if (!ready) return null;

  if (!booking) return null;

  return (
    <>
      <HeaderTwo links="checkout-payment" title="Bank Info" />

      <div className="page-content-wrapper">
        <div className="container">
          <div className="checkout-wrapper-area py-3">
            {/* Service Booking Summary */}
            <div className="payment-summary-wrapper mb-4">
              <div className="card">
                <div className="card-body">
                  <h6 className="mb-3">Service Booking Summary</h6>
                  <div className="mb-3">
                    <h6 className="mb-2">{booking.service.product_name}</h6>
                    <p className="text-muted small mb-2">
                      {booking.service.product_description}
                    </p>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Service Date</span>
                      <span className="fw-bold">
                        {booking.booking_details.start_date}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Service Time</span>
                      <span className="fw-bold">
                        {booking.booking_details.start_time}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Service Mode</span>
                      <span className="fw-bold">
                        {booking.booking_details.service_mode}
                      </span>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Service Price</span>
                    <span className="fw-bold">
                      ₦{booking.service.price.toLocaleString()}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">Total Amount</span>
                    <span className="fw-bold">
                      ₦{orderAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="credit-card-info-wrapper">
              <img
                className="d-block mb-4"
                src="/assets/img/bg-img/credit-card.png"
                alt=""
              />
              <div className="bank-ac-info">
                <p>
                  Make your payment directly into our bank account. Please use
                  your the tx-ref as the payment reference. Your service booking
                  won't be confirmed until the payment has been verified.
                </p>
                <ul className="list-group mb-3">
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0 border-bottom">
                    Bank Name<span>{BANK_NAME}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                    Account Number<span>{ACCOUNT_NUMBER}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center border-0">
                    Tx-Ref<span>{txRef && txRef}</span>
                  </li>
                </ul>
              </div>
              <button
                disabled={isLoading || isSuccess}
                className="btn btn-primary btn-lg w-100"
                onClick={handlePayment}
              >
                {isLoading ? "Processing..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />
    </>
  );
};

export default CheckoutServiceBank;
