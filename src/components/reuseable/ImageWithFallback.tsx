"use client";
import { useEffect, useState } from "react";

export default function ImageWithFallback({
  src,
  fallback = "/assets/img/product/product_fallback.png",
  alt = "",
  className = "",
  width,
  height,
}: {
  src: string;
  fallback?: string;
  alt: string;
  className?: string;
  width?: string | number;
  height?: string | number;
}) {
  const [imgSrc, setImgSrc] = useState(fallback);

  const handleError = () => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };
  // try loading the real image behind the scenes
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImgSrc(src);
    img.onerror = () => setImgSrc(fallback);
  }, []);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      // onLoad={handleError}
      loading="lazy"
      width={width && width}
      height={height && height}
    />
  );
}
