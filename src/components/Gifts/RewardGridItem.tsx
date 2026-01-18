"use client";

import Link from "next/link";
import ImageWithFallback from "../reuseable/ImageWithFallback";

type RewardGridItemProps = {
  reward: any;
  onClick?: () => void;
};

const RewardGridItem = ({ reward, onClick }: RewardGridItemProps) => {
  const status = reward.status?.toLowerCase() || "pending";

  return (
    <div className="card product-card gift-product-card h-100">
      <div className="card-body d-flex flex-column position-relative">
        {/* Status Badge */}
        <span
          className={`badge rounded-pill gift-badge-${status}`}
          style={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            zIndex: 10,
            textTransform: "capitalize",
          }}
        >
          {status}
        </span>

        {/* Thumbnail */}
        <Link
          className="product-thumbnail d-block"
          href={`/gifts/${reward.recognition_id}`}
        >
          <ImageWithFallback
            src={reward.image_url}
            alt={reward.product_name}
          />
        </Link>

        {/* Title */}
        <Link
          className="product-title d-block"
          href={`/gifts/${reward.recognition_id}`}
        >
          {reward.product_name}
        </Link>

        {/* Redeem Button */}
        <div className="mt-auto">
          <button
            className="btn gift-redeem-btn w-100"
            onClick={(e) => {
              e.preventDefault();
              onClick?.();
            }}
          >
            Redeem
          </button>
        </div>
      </div>
    </div>
  );
};

export default RewardGridItem;
