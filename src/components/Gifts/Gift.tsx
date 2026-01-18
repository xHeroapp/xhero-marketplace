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
      price: gift.product_price || 0,
      vendor: {
        vendor_id: gift.vendor_id ?? "unknown",
        vendor_name: gift.vendor_name,
        vendor_img: gift.vendor_avatar_url || gift.avatar_url || gift.vendor_image || "/assets/img/vendor/vendor-avatar.png",
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

      <div className="page-content-wrapper">
        {/* Product Image Container - Matches SingleProduct exactly */}
        <div className="product-image-container">
          <div className="product-image-wrapper">
            <ImageWithFallback src={gift.image_url} alt={gift.product_name} />
            {/* Vendor Badge */}
            {gift.vendor_name && (
              <div className="vendor-badge">
                {gift.vendor_name}
              </div>
            )}
          </div>
        </div>

        {/* Product Meta Section - Uses same classes as SingleProductArea */}
        <div className="product-description pb-3">
          <div className="product-title-meta-data bg-white mb-3 py-3">
            <div className="container d-flex justify-content-between rtl-flex-d-row-r">
              <div className="p-title-price">
                <h5 className="mb-1">{gift.product_name}</h5>
                <p className="sale-price mb-0 lh-1">
                  {formatCurrency(gift.product_price)}
                </p>
                {gift.product_description && (
                  <p className="mt-2 mb-0">{gift.product_description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Gift Details Section */}
          <div className="bg-white mb-3 py-3">
            <div className="container">
              <h6 className="mb-3">Gift Details</h6>

              <div className="d-flex justify-content-between py-2 border-bottom">
                <span className="text-muted">From</span>
                <span className="fw-bold">{gift.sender_name}</span>
              </div>

              {gift.program_name && (
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Program</span>
                  <span className="text-primary">{gift.program_name}</span>
                </div>
              )}

              {gift.category_name && (
                <div className="d-flex justify-content-between py-2 border-bottom">
                  <span className="text-muted">Category</span>
                  <span>{gift.category_name}</span>
                </div>
              )}

              <div className="d-flex justify-content-between py-2">
                <span className="text-muted">Status</span>
                <span className={`text-capitalize ${status === 'pending' ? 'text-warning' : status === 'redeemed' ? 'text-success' : 'text-secondary'}`}>
                  {status}
                </span>
              </div>
            </div>
          </div>

          {/* Message Section */}
          {gift.message && (
            <div className="bg-white mb-3 py-3">
              <div className="container">
                <h6 className="mb-3">Message</h6>
                <div className="bg-light p-3 rounded-3">
                  <i className="ti ti-quote text-muted d-block mb-2"></i>
                  <p className="mb-0 fst-italic">"{gift.message}"</p>
                </div>
              </div>
            </div>
          )}

          {/* Expiry Warning for Pending */}
          {status === "pending" && gift.expires_at && (
            <div className="bg-white mb-3 py-3">
              <div className="container">
                <div className="d-flex align-items-center text-warning">
                  <i className="ti ti-clock me-2"></i>
                  <span>Expires {formatDate(gift.expires_at)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Status Notice for Redeemed/Expired */}
          {(status === "redeemed" || status === "expired") && (
            <div className={`bg-white mb-3 py-3`}>
              <div className="container">
                <div className={`d-flex align-items-center gap-3 ${status === 'redeemed' ? 'text-success' : 'text-secondary'}`}>
                  <i className={`ti ${status === 'redeemed' ? 'ti-circle-check' : 'ti-clock-x'} fs-3`}></i>
                  <div>
                    <h6 className="mb-0 text-capitalize">{status}</h6>
                    <small className="text-muted">
                      {status === "redeemed"
                        ? `Redeemed on ${formatDate(gift.redemption_date)}`
                        : `Expired on ${formatDate(gift.expires_at)}`
                      }
                    </small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Button - Inline like Add to Cart */}
          {status === "pending" && (
            <div className="bg-white mb-3 py-3">
              <div className="container">
                <button
                  className="btn btn-primary w-100"
                  onClick={handleRedeemGift}
                  style={{ padding: "14px", borderRadius: "12px", fontWeight: 600 }}
                >
                  Redeem Gift
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Inline styles matching SingleProduct exactly */}
      <style jsx>{`
        .product-image-container {
          padding: 16px;
          background: linear-gradient(180deg, #f8f9fa 0%, #ffffff 100%);
        }
        .product-image-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;
          max-width: 400px;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.05),
            0 10px 15px -3px rgba(0, 0, 0, 0.08),
            0 20px 25px -5px rgba(0, 0, 0, 0.04);
        }
        .product-image-wrapper :global(img) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        .product-image-wrapper:hover :global(img) {
          transform: scale(1.02);
        }
        .vendor-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 6px 14px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          color: #1a1a1a;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          z-index: 10;
        }
      `}</style>

      <Footer />
    </>
  );
};

export default GiftDetailsPage;
