"use client";

import { useClientReady } from "@/hooks/useClientReady";
import { useHandlePayment } from "@/hooks/useHandlePayment";
import Footer from "@/layouts/Footer";
import HeaderTwo from "@/layouts/HeaderTwo";
import { useGetUser } from "@/queries/auth.queries";
import { useAuthStore } from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import useCheckoutStore from "@/store/checkoutStore";
import { formatCurrency } from "@/utils/formatCurrency";
import React, { useEffect, useState } from "react";

const CheckoutWallet = () => {
  const ready = useClientReady();

  // state
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Stores
  const { user } = useAuthStore();
  const { getVendorTotal } = useCartStore();
  const useGetUserQuery = useGetUser();
  const { getVendorCart } = useCheckoutStore();
  const vendorCart = getVendorCart();

  // update the user store to get the up to date user information
  useEffect(() => {
    useGetUserQuery.refetch();
  }, [useGetUserQuery.data]);

  const orderAmount = getVendorTotal(vendorCart && vendorCart.vendor.vendor_id);

  // Payment handler
  const { handlePayment } = useHandlePayment({
    orderAmount,
    vendorCart,
    setIsLoading,
    setIsSuccess,
    payment_method: "wallet",
    redirect_link: `/payment-success?vendor_id=${
      vendorCart && vendorCart.vendor.vendor_id
    }`,
  });

  if (!ready) return null;

  if (!vendorCart) return null;

  return (
    <>
      <HeaderTwo links="checkout-payment" title="Wallet" />

      <div className="page-content-wrapper">
        <div className="container">
          <div className="checkout-wrapper-area py-3">
            {/* Wallet Balance Card */}
            <div className="wallet-card-wrapper mb-4">
              <div className="wallet-card">
                <div className="wallet-card-gradient">
                  <div className="d-flex justify-content-between align-items-start mb-4">
                    <div>
                      <p className="wallet-label mb-1 text-white">
                        Wallet Balance
                      </p>
                      <h2 className="wallet-balance mb-0 text-white">
                        {formatCurrency(user?.points_balance)}
                      </h2>
                    </div>
                    <div className="wallet-icon">
                      <i className="ti ti-wallet"></i>
                    </div>
                  </div>

                  <div className="wallet-user-info">
                    <div className="mb-2">
                      <p className="wallet-label mb-0 text-white">
                        Account Holder
                      </p>
                      <p className="wallet-value mb-0 text-white">
                        {user?.full_name}
                      </p>
                    </div>
                    <div>
                      <p className="wallet-label mb-0 text-white">Email</p>
                      <p className="wallet-value mb-0 text-white">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="payment-summary-wrapper mb-4">
              <div className="card">
                <div className="card-body">
                  <h6 className="mb-3">Payment Summary</h6>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Order Amount</span>
                    <span className="fw-bold">
                      {formatCurrency(orderAmount.total)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Wallet Balance</span>
                    <span className="fw-bold">
                      {formatCurrency(user?.points_balance)}
                    </span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">Balance After Payment</span>
                    <span
                      className={`fw-bold ${
                        user?.points_balance - orderAmount.total >= 0
                          ? "text-success"
                          : "text-danger"
                      }`}
                    >
                      {formatCurrency(user?.points_balance - orderAmount.total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div
              className="alert alert-info d-flex align-items-center mb-4"
              role="alert"
            >
              <i className="ti ti-lock-square-rounded me-2"></i>
              <small>
                Your payment is secured with end-to-end encryption.
                {/* <a className="ms-1 fw-bold" href="#">
                  Learn More
                </a> */}
              </small>
            </div>

            {/* Payment Form */}
            <form onSubmit={(e) => handlePayment(e)}>
              <button
                className="btn btn-primary btn-lg w-100"
                type="submit"
                disabled={
                  Number(user?.points_balance) < orderAmount.total ||
                  isLoading ||
                  isSuccess
                }
                onClick={(e) => handlePayment(e)}
              >
                {Number(user?.points_balance) > orderAmount.total ? (
                  <>
                    <i className="ti ti-wallet me-2"></i>
                    Pay {formatCurrency(orderAmount.total)} from Wallet
                  </>
                ) : (
                  <>
                    <i className="ti ti-alert-circle me-2"></i>
                    Insufficient Balance
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="internet-connection-status" id="internetStatus"></div>

      <Footer />

      <style jsx>{`
        .wallet-card-wrapper {
          perspective: 1000px;
        }

        .wallet-card {
          background: #667eea;
          border-radius: 20px;
          padding: 30px;
          color: white;
          box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
          position: relative;
          overflow: hidden;
        }

        .wallet-card::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 70%
          );
          animation: pulse 4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        .wallet-card-gradient {
          position: relative;
          z-index: 1;
        }

        .wallet-label {
          font-size: 0.75rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
          opacity: 0.9;
        }

        .wallet-balance {
          font-size: 2.5rem;
          font-weight: 700;
          letter-spacing: -1px;
        }

        .wallet-icon {
          width: 50px;
          height: 50px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        }

        .wallet-icon i {
          font-size: 1.5rem;
        }

        .wallet-value {
          font-size: 0.95rem;
          font-weight: 600;
        }

        .payment-summary-wrapper .card {
          border: 1px solid #e9ecef;
          border-radius: 12px;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 576px) {
          .wallet-balance {
            font-size: 2rem;
          }

          .wallet-card {
            padding: 20px;
          }
        }
      `}</style>
    </>
  );
};

export default CheckoutWallet;
