"use client";

import ImageWithFallback from "../reuseable/ImageWithFallback";

type RewardGridItemProps = {
  reward: any;
  onClick?: () => void;
};

const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.split(" ").filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0]?.[0]?.toUpperCase() || "?";
};

const RewardGridItem = ({ reward, onClick }: RewardGridItemProps) => {
  const status = reward.status?.toLowerCase() || "pending";

  return (
    <div className="gift-card" onClick={onClick}>
      {/* Image Container */}
      <div className="gift-card-image">
        <ImageWithFallback
          src={reward.image_url}
          alt={reward.product_name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Status Badge */}
        <span className={`gift-status-badge ${status}`}>{status}</span>
      </div>

      {/* Content */}
      <div className="gift-card-content">
        {/* Title */}
        <h6 className="gift-card-title">{reward.product_name}</h6>

        {/* Sender Row */}
        <div className="gift-sender-row">
          <div className="gift-sender-avatar">
            {getInitials(reward.sender_name)}
          </div>
          <span className="gift-sender-name">
            From <strong>{reward.sender_name}</strong>
          </span>
        </div>

        {/* Program Tag */}
        <p className="gift-program-tag">{reward.program_name}</p>

        {/* Message Preview */}
        {reward.message && (
          <p className="gift-message-preview">"{reward.message}"</p>
        )}

        {/* View Details Link */}
        <span className="gift-view-link">
          View details
          <i className="ti ti-chevron-right"></i>
        </span>
      </div>
    </div>
  );
};

export default RewardGridItem;
