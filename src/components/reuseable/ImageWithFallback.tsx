"use client";
import { useState } from "react";
import NextImage from "next/image";

export default function ImageWithFallback({
  src,
  fallback = "/assets/img/product/product_fallback.png",
  alt = "",
  className = "",
  width,
  height,
  style,
}: {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
  style?: {};
}) {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  const isExternal = imgSrc.startsWith("http") && !imgSrc.includes("fhvjjbnjecwbdslvemsa.supabase.co");

  const handleError = () => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  // If explicit width/height are provided, use sized mode
  if (width && height) {
    return (
      <NextImage
        src={imgSrc}
        alt={alt}
        width={typeof width === "string" ? parseInt(width, 10) : width}
        height={typeof height === "string" ? parseInt(height, 10) : height}
        className={className}
        onError={handleError}
        unoptimized={isExternal}
        style={{ ...style, borderRadius: "12px", objectFit: "cover" }}
        sizes="(max-width: 768px) 50vw, 33vw"
      />
    );
  }

  // Default: fill mode — image fills its positioned parent
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1 / 1",
      }}
    >
      <NextImage
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        onError={handleError}
        unoptimized={isExternal}
        style={{ ...style, borderRadius: "12px", objectFit: "cover" }}
        sizes="(max-width: 768px) 50vw, 33vw"
      />
    </div>
  );
}

