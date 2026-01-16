"use client";

import { useClientReady } from "@/hooks/useClientReady";
import { useHandlePayment } from "@/hooks/useHandlePayment";
import { useGetUser } from "@/queries/auth.queries";
import { useAuthStore } from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import useCheckoutStore from "@/store/checkoutStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const CheckoutWallet = () => {
  const ready = useClientReady();
  const router = useRouter();

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

  const hasSufficientBalance =
    Number(user?.points_balance) >= orderAmount.total;
  const balanceAfterPayment = (user?.points_balance || 0) - orderAmount.total;

  if (!ready) return null;

  if (!vendorCart) return null;

  return (
    <>
      {/* Minimal Header - No hamburger menu for focused checkout experience */}
      <div className="wallet-header">
        <div className="header-container">
          <button
            className="back-btn"
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <i className="ti ti-arrow-left"></i>
          </button>
          <h1 className="header-title">Wallet Payment</h1>
          <div className="header-spacer"></div>
        </div>
      </div>

      <div className="wallet-page">
        <div className="wallet-content">
          {/* Premium Wallet Card */}
          <div className="wallet-card-container">
            <div className="wallet-card">
              <div className="card-shimmer"></div>
              <div className="card-pattern"></div>
              <div className="card-content">
                <div className="card-header">
                  <div className="balance-section">
                    <span className="balance-label">Available Balance</span>
                    <h2 className="balance-amount">
                      {formatCurrency(user?.points_balance)}
                    </h2>
                  </div>
                  <div className="wallet-icon-wrapper">
                    <div className="wallet-icon">
                      <i className="ti ti-wallet"></i>
                    </div>
                  </div>
                </div>

                <div className="card-divider"></div>

                <div className="user-details">
                  <div className="detail-item">
                    <span className="detail-label">Account Holder</span>
                    <span className="detail-value">
                      {user?.full_name || "—"}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{user?.email || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary Card */}
          <div className="summary-card">
            <div className="summary-header">
              <i className="ti ti-receipt"></i>
              <h3>Payment Summary</h3>
            </div>

            <div className="summary-body">
              <div className="summary-row">
                <span className="row-label">Order Amount</span>
                <span className="row-value">
                  {formatCurrency(orderAmount.total)}
                </span>
              </div>

              <div className="summary-row">
                <span className="row-label">Wallet Balance</span>
                <span className="row-value">
                  {formatCurrency(user?.points_balance)}
                </span>
              </div>

              <div className="summary-divider"></div>

              <div className="summary-row total-row">
                <span className="row-label">Balance After Payment</span>
                <span
                  className={`row-value ${
                    balanceAfterPayment >= 0 ? "positive" : "negative"
                  }`}
                >
                  {formatCurrency(balanceAfterPayment)}
                </span>
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="security-badge">
            <div className="security-icon">
              <i className="ti ti-shield-check"></i>
            </div>
            <div className="security-text">
              <span className="security-title">Secure Payment</span>
              <span className="security-subtitle">
                End-to-end encrypted transaction
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="action-container">
            <button
              className={`pay-button ${
                !hasSufficientBalance ? "insufficient" : ""
              } ${isLoading ? "loading" : ""}`}
              type="button"
              disabled={!hasSufficientBalance || isLoading || isSuccess}
              onClick={(e) => handlePayment(e)}
            >
              {isLoading ? (
                <div className="button-loading">
                  <div className="spinner"></div>
                  <span>Processing...</span>
                </div>
              ) : hasSufficientBalance ? (
                <>
                  <i className="ti ti-wallet"></i>
                  <span>Pay {formatCurrency(orderAmount.total)}</span>
                </>
              ) : (
                <>
                  <i className="ti ti-alert-triangle"></i>
                  <span>Insufficient Balance</span>
                </>
              )}
            </button>

            {!hasSufficientBalance && (
              <p className="insufficient-hint">
                You need{" "}
                {formatCurrency(
                  orderAmount.total - (user?.points_balance || 0)
                )}{" "}
                more to complete this purchase
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ========== Header Styles ========== */
        .wallet-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          max-width: 600px;
          margin: 0 auto;
        }

        .back-btn {
          width: 40px;
          height: 40px;
          border: none;
          background: #f5f5f7;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-btn:hover {
          background: #e8e8ed;
          transform: translateX(-2px);
        }

        .back-btn i {
          font-size: 20px;
          color: #1d1d1f;
        }

        .header-title {
          font-size: 17px;
          font-weight: 600;
          color: #1d1d1f;
          margin: 0;
          letter-spacing: -0.3px;
        }

        .header-spacer {
          width: 40px;
        }

        /* ========== Page Layout ========== */
        .wallet-page {
          min-height: calc(100vh - 73px);
          background: linear-gradient(180deg, #f5f5f7 0%, #ffffff 100%);
          padding-bottom: 40px;
        }

        .wallet-content {
          max-width: 600px;
          margin: 0 auto;
          padding: 24px 20px;
        }

        /* ========== Premium Wallet Card ========== */
        .wallet-card-container {
          margin-bottom: 24px;
          perspective: 1000px;
        }

        .wallet-card {
          position: relative;
          background: linear-gradient(
            135deg,
            #6366f1 0%,
            #8b5cf6 50%,
            #a855f7 100%
          );
          border-radius: 24px;
          padding: 28px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(99, 102, 241, 0.3),
            0 8px 16px rgba(99, 102, 241, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
          transform-style: preserve-3d;
          animation: cardFloat 6s ease-in-out infinite;
        }

        @keyframes cardFloat {
          0%,
          100% {
            transform: translateY(0) rotateX(0);
          }
          50% {
            transform: translateY(-4px) rotateX(1deg);
          }
        }

        .card-shimmer {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
          0% {
            left: -100%;
          }
          100% {
            left: 100%;
          }
        }

        .card-pattern {
          position: absolute;
          top: 0;
          right: 0;
          width: 200px;
          height: 200px;
          background: radial-gradient(
            circle,
            rgba(255, 255, 255, 0.1) 0%,
            transparent 70%
          );
          transform: translate(30%, -30%);
        }

        .card-content {
          position: relative;
          z-index: 1;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .balance-section {
          flex: 1;
        }

        .balance-label {
          display: block;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: rgba(255, 255, 255, 0.8);
          margin-bottom: 8px;
        }

        .balance-amount {
          font-size: 36px;
          font-weight: 700;
          color: #ffffff;
          margin: 0;
          letter-spacing: -1px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .wallet-icon-wrapper {
          padding: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(10px);
        }

        .wallet-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .wallet-icon i {
          font-size: 24px;
          color: #ffffff;
        }

        .card-divider {
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          margin: 20px 0;
        }

        .user-details {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .detail-label {
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: rgba(255, 255, 255, 0.7);
        }

        .detail-value {
          font-size: 14px;
          font-weight: 600;
          color: #ffffff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ========== Summary Card ========== */
        .summary-card {
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04),
            0 1px 3px rgba(0, 0, 0, 0.02);
          margin-bottom: 20px;
        }

        .summary-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 20px 24px 16px;
          border-bottom: 1px solid #f5f5f7;
        }

        .summary-header i {
          font-size: 20px;
          color: #6366f1;
        }

        .summary-header h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1d1d1f;
        }

        .summary-body {
          padding: 20px 24px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 0;
        }

        .row-label {
          font-size: 14px;
          color: #86868b;
        }

        .row-value {
          font-size: 15px;
          font-weight: 600;
          color: #1d1d1f;
        }

        .summary-divider {
          height: 1px;
          background: #f5f5f7;
          margin: 8px 0;
        }

        .total-row {
          padding-top: 16px;
        }

        .total-row .row-label {
          font-weight: 600;
          color: #1d1d1f;
        }

        .total-row .row-value.positive {
          color: #34c759;
        }

        .total-row .row-value.negative {
          color: #ff3b30;
        }

        /* ========== Security Badge ========== */
        .security-badge {
          display: flex;
          align-items: center;
          gap: 14px;
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
          border: 1px solid #bbf7d0;
          border-radius: 16px;
          padding: 16px 20px;
          margin-bottom: 24px;
        }

        .security-icon {
          width: 44px;
          height: 44px;
          background: #dcfce7;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .security-icon i {
          font-size: 22px;
          color: #22c55e;
        }

        .security-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .security-title {
          font-size: 14px;
          font-weight: 600;
          color: #166534;
        }

        .security-subtitle {
          font-size: 12px;
          color: #15803d;
        }

        /* ========== Action Button ========== */
        .action-container {
          text-align: center;
        }

        .pay-button {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 18px 32px;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border: none;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35),
            0 4px 8px rgba(99, 102, 241, 0.2);
        }

        .pay-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(99, 102, 241, 0.4),
            0 6px 12px rgba(99, 102, 241, 0.25);
        }

        .pay-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .pay-button:disabled {
          cursor: not-allowed;
          opacity: 0.95;
        }

        .pay-button.insufficient {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          box-shadow: 0 8px 24px rgba(251, 191, 36, 0.35),
            0 4px 8px rgba(251, 191, 36, 0.2);
        }

        .pay-button.loading {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
        }

        .pay-button i {
          font-size: 20px;
        }

        .button-loading {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .insufficient-hint {
          margin: 16px 0 0;
          font-size: 13px;
          color: #86868b;
        }

        /* ========== Responsive ========== */
        @media (max-width: 480px) {
          .wallet-content {
            padding: 20px 16px;
          }

          .wallet-card {
            padding: 24px;
            border-radius: 20px;
          }

          .balance-amount {
            font-size: 28px;
          }

          .user-details {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .summary-header,
          .summary-body {
            padding-left: 20px;
            padding-right: 20px;
          }

          .pay-button {
            padding: 16px 24px;
            font-size: 15px;
            border-radius: 14px;
          }
        }
      `}</style>
    </>
  );
};

export default CheckoutWallet;
