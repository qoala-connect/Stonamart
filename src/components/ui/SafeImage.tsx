"use client";

import React, { useState } from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackClassName?: string;
}

/**
 * Drop-in replacement for next/image that never leaves a blank hole.
 * If the remote source fails to load (network policy, broken URL, etc.),
 * it shows a soft stone-toned gradient instead of nothing.
 */
export function SafeImage({ fallbackClassName, className, alt, ...props }: SafeImageProps) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          fallbackClassName
        )}
        style={{
          background: "linear-gradient(145deg, #e8dcc4 0%, #d4c4a0 45%, #c9b088 100%)",
        }}
        role="img"
        aria-label={typeof alt === "string" ? alt : "Image unavailable"}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="opacity-30">
          <path d="M3 16.5V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2.5M8 11l2.5 3 3.5-4.5L19 16H5l3-5Z" stroke="#3a2f26" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="8" cy="8" r="1.5" stroke="#3a2f26" strokeWidth="1.4" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      className={className}
      onError={() => setErrored(true)}
    />
  );
}
