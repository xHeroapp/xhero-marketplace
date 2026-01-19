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
    <>
      <div className="user-profile-icon ms-2">
        <Link href="/profile">
          {showFallback ? (
            <div className="avatar-fallback">
              <i className="ti ti-user"></i>
            </div>
          ) : (
            <div className="avatar-container">
              <img
                src={src || ""}
                alt={alt}
                onError={() => setImageError(true)}
                className="avatar-image"
              />
            </div>
          )}
        </Link>
      </div>

      <style jsx>{`
        .user-profile-icon {
          position: relative;
        }

        .user-profile-icon :global(a) {
          display: block;
          text-decoration: none;
        }

        .avatar-fallback,
        .avatar-container {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: all 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);
        }

        .avatar-fallback {
          background: #f5f5f7;
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: #1d1d1f;
        }

        .avatar-fallback i {
          font-size: 18px;
        }

        .avatar-container {
          background: #f5f5f7;
          border: 1px solid rgba(0, 0, 0, 0.08); /* Unified border for image too */
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Hover Effect */
        .avatar-fallback:hover,
        .avatar-container:hover {
          transform: translateY(-1px);
          border-color: rgba(0, 0, 0, 0.12);
        }

        /* Dark Mode */
        :global([theme-color="dark"]) .avatar-fallback {
          background: #2c2c2e;
          border-color: rgba(255, 255, 255, 0.1);
          color: #ffffff;
        }

        :global([theme-color="dark"]) .avatar-container {
          border-color: rgba(255, 255, 255, 0.1);
          background: #1c1c1e;
        }
      `}</style>
    </>
  );
};

export default UserAvatar;
