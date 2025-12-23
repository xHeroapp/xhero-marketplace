import ImageWithFallback from "../reuseable/ImageWithFallback";

type RewardListItemProps = {
  reward: any;
  onClick?: () => void;
};

const statusColors: Record<string, string> = {
  rewarded: "#22c55e",
  pending: "#f59e0b",
  redeemed: "#6366f1",
};

const RewardListItem = ({ reward, onClick }: RewardListItemProps) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      <div style={{ display: "flex", gap: 12 }}>
        {/* Image */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 10,
            overflow: "hidden",
            flexShrink: 0,
            background: "#f3f4f6",
          }}
        >
          <ImageWithFallback
            src={reward.image_url}
            alt={reward.product_name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {/* Title + Status */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <h6 style={{ margin: 0, fontWeight: 600 }}>
              {reward.product_name}
            </h6>

            <span
              style={{
                fontSize: 12,
                padding: "2px 8px",
                borderRadius: 999,
                background: statusColors[reward.status] + "20" || "#e5e7eb",
                color: statusColors[reward.status] || "#374151",
                fontWeight: 500,
              }}
            >
              {reward.status}
            </span>
          </div>

          {/* Meta */}
          <p
            style={{
              margin: "4px 0",
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            From <strong>{reward.sender_name}</strong>
          </p>

          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#6b7280",
            }}
          >
            Program: {reward.program_name}
          </p>

          {/* Message */}
          {reward.message && (
            <p
              style={{
                marginTop: 6,
                fontSize: 13,
                fontStyle: "italic",
                color: "#4b5563",
              }}
            >
              “{reward.message}”
            </p>
          )}

          {/* Action */}
          <span
            style={{
              display: "inline-block",
              marginTop: 8,
              fontSize: 13,
              color: "#2563eb",
              fontWeight: 500,
            }}
          >
            View details
          </span>
        </div>
      </div>
    </div>
  );
};

export default RewardListItem;
