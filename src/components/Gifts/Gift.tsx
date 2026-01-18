"use client";

import HeaderTwo from "@/layouts/HeaderTwo";
import Footer from "@/layouts/Footer";
import { formatCurrency } from "@/utils/formatCurrency";
import { useEffect } from "react";
import useRewardCartStore from "@/store/rewardCartStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import ImageWithFallback from "../reuseable/ImageWithFallback";

type GiftDetailsPageProps = {
  gift: any;
};

const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0]?.[0]?.toUpperCase() || "?";
};

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const GiftDetailsPage = ({ gift }: GiftDetailsPageProps) => {
  const { user } = useAuthStore();
  const { redeemReward } = useRewardCartStore();
  const router = useRouter();

  const status = gift?.status?.toLowerCase() || "pending";

  // Function to handle redeeming gift
  const handleRedeemGift = () => {
    if (!gift || !user) return;

    // Map gift to rewardCart format
    const reward = {
      product_id: gift.vendor_product_id,
      product_name: gift.product_name,
      product_description: gift.product_description,
      image_url: gift.image_url,
      price: 0, // force zero
      vendor: {
        vendor_id: gift.vendor_id ?? "unknown",
        vendor_name: gift.vendor_name,
        vendor_img:
          gift.vendor_avatar ?? "/assets/img/vendor/vendor-avatar.png",
      },
      redemption_code: gift.redemption_code,
      recognition_id: gift.recognition_id,
      program_name: gift.program_name,
      department_name: gift.department_name,
      sender_name: gift.sender_name,
    };

    redeemReward(reward);
    router.push("/checkout-reward");
  };

  useEffect(() => {
    console.log(gift);
  }, [gift]);

  return (
    <>
      <HeaderTwo title="Gift Details" links="home" />

      <div className="page-content-wrapper gift-details-page">
        {/* Hero Section */}
        <div className="gift-hero">
          <ImageWithFallback
            src={gift.image_url}
            alt={gift.product_name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />

          {/* Status Badge */}
          <span className={`gift-detail-status ${status}`}>{status}</span>

          {/* Gradient Overlay with Title */}
          <div className="gift-hero-overlay">
            <h1 className="gift-hero-title">{gift.product_name}</h1>
            <span className="gift-hero-vendor">
              {gift.vendor_name} • {gift.category_name}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="gift-details-content">
          {/* Product Info Card */}
          <div className="gift-section-card">
            <div className="gift-product-info">
              <div>
                <span className="gift-product-category">
                  {gift.category_name}
                </span>
                <p className="gift-product-description">
                  {gift.product_description}
                </p>
              </div>
              <span className="gift-product-price">
                {formatCurrency(gift.product_price)}
              </span>
            </div>
          </div>

          {/* Recognition Message */}
          {(gift.message || gift.program_description) && (
            <div className="gift-section-card gift-message-card">
              <p className="gift-message-text">
                {gift.message || gift.program_description}
              </p>
              <span className="gift-program-name">
                <i className="ti ti-award"></i>
                {gift.program_name}
              </span>
            </div>
          )}

          {/* Sender Card */}
          <div className="gift-section-card">
            <div className="gift-sender-card">
              <div className="gift-sender-lg-avatar">
                {getInitials(gift.sender_name)}
              </div>
              <div className="gift-sender-info">
                <h6>{gift.sender_name}</h6>
                <p>
                  To: {gift.recipient_name} • {gift.department_name}
                </p>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="gift-section-card">
            {/* Pending Status */}
            {status === "pending" && (
              <>
                {gift.redemption_code && (
                  <div className="gift-redemption-code">
                    <div className="label">Redemption Code</div>
                    <div className="code">{gift.redemption_code}</div>
                  </div>
                )}

                {gift.expires_at && (
                  <div className="gift-expiry-warning">
                    <i className="ti ti-clock"></i>
                    <span>Expires on {formatDate(gift.expires_at)}</span>
                  </div>
                )}
              </>
            )}

            {/* Redeemed Status */}
            {status === "redeemed" && (
              <div className="gift-status-section redeemed">
                <i className="ti ti-circle-check"></i>
                <p>This gift has been successfully redeemed!</p>
                {gift.redemption_date && (
                  <span className="date">
                    Redeemed on {formatDate(gift.redemption_date)}
                  </span>
                )}
              </div>
            )}

            {/* Expired Status */}
            {status === "expired" && (
              <div className="gift-status-section expired">
                <i className="ti ti-clock-x"></i>
                <p>This gift has expired and can no longer be redeemed.</p>
                {gift.expires_at && (
                  <span className="date">
                    Expired on {formatDate(gift.expires_at)}
                  </span>
                )}
              </div>
            )}

            {/* Details List */}
            <ul className="gift-details-list" style={{ marginTop: 16 }}>
              <li>
                <span className="label">Status</span>
                <span className="value" style={{ textTransform: "capitalize" }}>
                  {status}
                </span>
              </li>
              <li>
                <span className="label">Program</span>
                <span className="value">{gift.program_name}</span>
              </li>
              <li>
                <span className="label">From</span>
                <span className="value">{gift.sender_name}</span>
              </li>
              <li>
                <span className="label">Recipient</span>
                <span className="value">{gift.recipient_email}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* CTA Button - Only for Pending */}
        {status === "pending" && (
          <button
            className="gift-cta-button"
            onClick={handleRedeemGift}
            disabled={!gift.redemption_code}
          >
            Redeem Gift
          </button>
        )}
      </div>

      <Footer />
    </>
  );
};

export default GiftDetailsPage;
