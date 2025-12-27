import ImageWithFallback from "../reuseable/ImageWithFallback";

type RewardGridItemProps = {
  reward: any;
  onClick?: () => void;
};

const statusColors: Record<string, string> = {
  rewarded: "#22c55e",
  pending: "#f59e0b",
  redeemed: "#6366f1",
  completed: "#6366f1",
};

const RewardGridItem = ({ reward, onClick }: RewardGridItemProps) => {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        padding: 12,
        boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        cursor: "pointer",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
      onClick={onClick}
    >
      {/* Image */}
      <div
        style={{
          width: "100%",
          paddingTop: "100%", // 1:1 aspect ratio
          position: "relative",
          borderRadius: 10,
          overflow: "hidden",
          background: "#f3f4f6",
          marginBottom: 12,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
        >
          <ImageWithFallback
            src={reward.image_url}
            alt={reward.product_name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Status badge */}
        <span
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            fontSize: 11,
            padding: "4px 10px",
            borderRadius: 999,
            background: "white",
            color: statusColors[reward.status] || "#374151",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {reward.status}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Title */}
        <h6
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: 14,
            marginBottom: 6,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {reward.product_name}
        </h6>

        {/* From */}
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "#6b7280",
            marginBottom: 4,
          }}
        >
          From <strong>{reward.sender_name}</strong>
        </p>

        {/* Program */}
        <p
          style={{
            margin: 0,
            fontSize: 11,
            color: "#9ca3af",
            marginBottom: 8,
          }}
        >
          {reward.program_name}
        </p>

        {/* Message */}
        {reward.message && (
          <p
            style={{
              margin: 0,
              fontSize: 12,
              fontStyle: "italic",
              color: "#4b5563",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              marginBottom: 8,
            }}
          >
            "{reward.message}"
          </p>
        )}

        {/* Action */}
        <span
          style={{
            fontSize: 12,
            color: "#2563eb",
            fontWeight: 500,
            marginTop: "auto",
          }}
        >
          View details
        </span>
      </div>
    </div>
  );
};

export default RewardGridItem;
