import { useState, type ImgHTMLAttributes } from "react";
import { cn } from "~/lib/util";

export interface ImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  /** Short label shown inside the placeholder when the image is missing. */
  fallbackLabel?: string;
}

/**
 * Image with a graceful fallback: if `src` is missing or fails to load, render
 * a styled placeholder (warm gradient + gold initial) instead of a broken icon.
 */
export function Img({ alt, fallbackLabel, className, onError, ...props }: ImgProps) {
  const [failed, setFailed] = useState(false);
  const showPlaceholder = failed || !props.src;

  if (showPlaceholder) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          "flex items-center justify-center bg-gradient-to-br from-champagne-200 via-champagne-100 to-gold-200 text-ink-400",
          className
        )}
      >
        <span className="font-display text-3xl font-semibold text-gold-600">
          {(fallbackLabel ?? alt).trim().charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img
      alt={alt}
      loading="lazy"
      className={className}
      onError={(e) => {
        setFailed(true);
        onError?.(e);
      }}
      {...props}
    />
  );
}
