"use client";

import { useState } from "react";
import Link from "next/link";

interface UserAvatarProps {
  src?: string | null;
  alt?: string;
  fallbackText?: string; // User's name or initials
}

const UserAvatar = ({
  src,
  alt = "User",
  fallbackText = "U",
}: UserAvatarProps) => {
  const [imageError, setImageError] = useState(false);

  // Generate initials from name (e.g., "John Doe" -> "JD")
  const getInitials = (text: string) => {
    return text
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getInitials(fallbackText);
  const showFallback = !src || imageError;

  return (
    <div className="user-profile-icon ms-2">
      <Link href="/profile">
        {showFallback ? (
          <div className="avatar-fallback d-flex align-items-center justify-content-center">
            <span>{initials}</span>
          </div>
        ) : (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="avatar-image"
          />
        )}
      </Link>
    </div>
  );
};

export default UserAvatar;
