import React, { useState } from "react";

interface AvatarProps {
  url?: string | null;
  displayName?: string | null;
  highlightBorder?: boolean;
  size?: number;
}

export const Avatar: React.FC<AvatarProps> = ({
  url,
  displayName,
  highlightBorder = false,
  size = 40,
}) => {
  const [imgError, setImgError] = useState(false);

  const firstLetter = displayName?.charAt(0).toUpperCase();
  const fontSize = size * 0.5;

  const borderClass = highlightBorder ? "ring-2 ring-primary/70" : "";

  return url && !imgError ? (
    <img
      src={url}
      alt={displayName ?? ""}
      title={displayName ?? ""}
      onError={() => setImgError(true)}
      className={`rounded-full object-cover ${borderClass}`}
      style={{ width: size, height: size }}
      loading="lazy"
    />
  ) : (
    <div
      className={`rounded-full bg-background flex items-center justify-center text-foreground/70 select-none ${borderClass}`}
      style={{ width: size, height: size, fontSize }}
      title={displayName ?? ""}
      aria-label={displayName ?? undefined}
    >
      {firstLetter}
    </div>
  );
};
