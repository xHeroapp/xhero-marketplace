"use client";

import HeaderTwo from "@/layouts/HeaderTwo";
import Footer from "@/layouts/Footer";
import { formatCurrency } from "@/utils/formatCurrency";
import useRewardCartStore from "@/store/rewardCartStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import ImageWithFallback from "../reuseable/ImageWithFallback";

type GiftDetailsPageProps = {
  gift: any;
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

  const handleRedeemGift = () => {
    if (!gift || !user) return;

    const reward = {
      product_id: gift.vendor_product_id,
      product_name: gift.product_name,
      product_description: gift.product_description,
      image_url: gift.image_url,
      price: 0,
      vendor: {
        vendor_id: gift.vendor_id ?? "unknown",
        vendor_name: gift.vendor_name,
        vendor_img: gift.vendor_avatar ?? "/assets/img/vendor/vendor-avatar.png",
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

  return (
    <>
      <HeaderTwo title="Gift Details" links="gifts" />

      <div className="page-content-wrapper gift-details-page-v3">
        {/* Product Image Container - Apple-style minimalism matching regular product page */}
        <div className="gift-image-container">
          <div className="gift-image-wrapper">
            <ImageWithFallback src={gift.image_url} alt={gift.product_name} />

            {/* Vendor Badge - Top Right */}
            {gift.vendor_name && (
              <div className="gift-vendor-badge">
                {gift.vendor_name}
              </div>
            )}

            {/* Status Badge removed as per request */}
          </div>
        </div>

        {/* Product Meta Section */}
        <div className="gift-details-content-v3">

          {/* Main Info Card */}
          <div className="gift-meta-card mb-3">
            <div className="container">
              <div className="gift-header-row">
                <div className="gift-title-price">
                  <h5 className="gift-product-name">{gift.product_name}</h5>
                  <p className="gift-price mb-2">
                    {formatCurrency(gift.product_price)}
                    <span className="gift-category ms-2">• {gift.category_name}</span>
                  </p>
                  {gift.product_description && (
                    <p className="gift-description">{gift.product_description}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Gift Source & Message Card */}
          <div className="gift-source-card mb-3">
            <div className="container">
              <h6 className="section-label">Gift Details</h6>

              <div className="gift-source-row">
                <span className="label">From</span>
                <span className="value fw-bold">{gift.sender_name}</span>
              </div>

              {gift.program_name && (
                <div className="gift-source-row">
                  <span className="label">Program</span>
                  <span className="value text-primary">{gift.program_name}</span>
                </div>
              )}

              {gift.message && (
                <div className="gift-message-box mt-3">
                  <i className="ti ti-quote text-muted mb-1 d-block"></i>
                  <p className="mb-0 fst-italic text-dark">"{gift.message}"</p>
                </div>
              )}
            </div>
          </div>

          {/* Status Specific Card */}
          {(status === "redeemed" || status === "expired") && (
            <div className={`gift-status-card mb-3 ${status}`}>
              <div className="container d-flex align-items-center gap-3">
                <i className={`ti ${status === 'redeemed' ? 'ti-circle-check' : 'ti-clock-x'} fs-2`}></i>
                <div>
                  <h6 className="mb-0 text-capitalize">{status}</h6>
                  <small>
                    {status === "redeemed"
                      ? `Redeemed on ${formatDate(gift.redemption_date)}`
                      : `Expired on ${formatDate(gift.expires_at)}`
                    }
                  </small>
                </div>
              </div>
            </div>
          )}

          {/* Expiry Warning for Pending */}
          {status === "pending" && gift.expires_at && (
            <div className="container mb-3">
              <div className="gift-expiry-simple">
                <i className="ti ti-clock me-1"></i> Expires {formatDate(gift.expires_at)}
              </div>
            </div>
          )}

        </div>

        {/* Floating Action Button */}
        {status === "pending" && (
          <div className="gift-action-container">
            <button
              className="gift-redeem-btn-fixed"
              onClick={handleRedeemGift}
            >
              Redeem Gift
            </button>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default GiftDetailsPage;
