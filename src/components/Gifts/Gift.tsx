"use client";

import HeaderTwo from "@/layouts/HeaderTwo";
import Footer from "@/layouts/Footer";
import { formatCurrency } from "@/utils/formatCurrency";
import { useGetGiftById } from "@/queries/gifts.queries";
import { useEffect } from "react";
import useRewardCartStore from "@/store/rewardCartStore";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

type GiftDetailsPageProps = {
  params: {
    id: string;
  };
};

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "pending":
      return "badge-warning";
    case "redeemed":
      return "badge-success";
    case "expired":
      return "badge-danger";
    default:
      return "badge-secondary";
  }
};

const GiftDetailsPage = ({ gift }) => {
  //   const { data: gift, isLoading, isError } = useGetGiftById(params.id);

  //   if (isLoading) {
  //     return (
  //       <>
  //         <HeaderTwo title="Gift Details" links="home" />
  //         <div className="container py-5 text-center">Loading gift...</div>
  //         <Footer />
  //       </>
  //     );
  //   }

  //   if (isError || !gift) {
  //     return (
  //       <>
  //         <HeaderTwo title="Gift Details" links="home" />
  //         <div className="container py-5 text-center text-danger">
  //           Failed to load gift details
  //         </div>
  //         <Footer />
  //       </>
  //     );
  //   }

  const { user } = useAuthStore();
  const { redeemReward } = useRewardCartStore();
  const router = useRouter();

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
        vendor_id: gift.vendor_id ?? "unknown", // fallback
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

    // redirect
    router.push("/checkout-reward");
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "badge-warning";
      case "redeemed":
        return "badge-success";
      case "expired":
        return "badge-danger";
      default:
        return "badge-secondary";
    }
  };

  useEffect(() => {
    console.log(gift);
  }, [gift]);
  return (
    <>
      <HeaderTwo title="Gift Details" links="home" />

      <div className="page-content-wrapper">
        <div className="container py-3">
          {/* PRODUCT */}
          <div className="card mb-3">
            <img
              src={gift.image_url}
              alt={gift.product_name}
              className="card-img-top"
              style={{ maxHeight: 280, objectFit: "cover" }}
            />
            <div className="card-body">
              <h5 className="mb-1">{gift.product_name}</h5>
              <p className="text-muted mb-2">
                {gift.vendor_name} • {gift.category_name}
              </p>
              <p>{gift.product_description}</p>
              <h6 className="fw-bold">{formatCurrency(gift.product_price)}</h6>
            </div>
          </div>

          {/* PROGRAM */}
          <div className="card mb-3">
            <div className="card-body">
              <h6 className="fw-bold">{gift.program_name}</h6>
              <p className="text-muted mb-2">{gift.program_description}</p>

              {gift.message && (
                <blockquote className="blockquote mb-0">
                  “{gift.message}”
                </blockquote>
              )}
            </div>
          </div>

          {/* PEOPLE */}
          <div className="card mb-3">
            <div className="card-body">
              <p className="mb-1">
                <strong>From:</strong> {gift.sender_name}
              </p>
              <p className="mb-1">
                <strong>To:</strong> {gift.recipient_name}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> {gift.recipient_email}
              </p>
              <p className="mb-0">
                <strong>Department:</strong> {gift.department_name}
              </p>
            </div>
          </div>

          {/* REDEMPTION */}
          <div className="card mb-3">
            <div className="card-body">
              <p className="mb-2">
                <strong>Status:</strong>{" "}
                <span className={`badge ${getStatusBadgeClass(gift.status)}`}>
                  {gift.status}
                </span>
              </p>

              {/* PENDING */}
              {gift.status === "pending" && (
                <>
                  {gift.redemption_code && (
                    <p className="fw-bold">
                      Redemption Code: {gift.redemption_code}
                    </p>
                  )}

                  {gift.expires_at && (
                    <p className="text-muted">
                      Expires on:{" "}
                      {new Date(gift.expires_at).toLocaleDateString()}
                    </p>
                  )}

                  <button
                    className="btn btn-primary w-100 mt-2"
                    disabled={!gift.redemption_code}
                    onClick={handleRedeemGift}
                  >
                    Redeem Gift
                  </button>
                </>
              )}

              {/* REDEEMED */}
              {gift.status === "redeemed" && (
                <>
                  <p className="text-success fw-semibold">
                    This gift has already been redeemed.
                  </p>

                  {gift.redemption_date && (
                    <p>
                      Redeemed on:{" "}
                      {new Date(gift.redemption_date).toLocaleDateString()}
                    </p>
                  )}
                </>
              )}

              {/* EXPIRED */}
              {gift.status === "expired" && (
                <>
                  <p className="text-danger fw-semibold">
                    This gift has expired and can no longer be redeemed.
                  </p>

                  {gift.expires_at && (
                    <p>
                      Expired on:{" "}
                      {new Date(gift.expires_at).toLocaleDateString()}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default GiftDetailsPage;
