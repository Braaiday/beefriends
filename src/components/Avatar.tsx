import React, { useState } from "react";
import { StatusColors } from "../types/StatusColors";

interface AvatarProps {
  url?: string | null;
  displayName?: string | null;
  size?: number | "sm" | "md" | "lg";
  useStatus?: boolean;
  status?: keyof typeof StatusColors;
}

const sizeMap = {
  sm: 30,
  md: 40,
  lg: 50,
};

export const Avatar: React.FC<AvatarProps> = ({
  url,
  displayName,
  size = "md",
  useStatus = false,
  status = "offline",
}) => {
  const [imgError, setImgError] = useState(false);

  // Normalize size to number
  const numericSize = typeof size === "string" ? sizeMap[size] : size;

  const firstLetter = displayName?.charAt(0).toUpperCase();
  const fontSize = numericSize * 0.5;

  return (
    <div
      className="relative"
      style={{ width: numericSize, height: numericSize }}
      title={displayName ?? ""}
    >
      {url && !imgError ? (
        <div
          className="rounded-full bg-background flex items-center justify-center text-foreground/70 select-none w-full h-full"
          style={{ fontSize }}
          aria-label={displayName ?? undefined}
        >
          <img
            src={url}
            alt={displayName ?? ""}
            onError={() => setImgError(true)}
            className="rounded-full object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="rounded-full bg-background flex items-center justify-center text-foreground/70 select-none w-full h-full"
          style={{ fontSize }}
          aria-label={displayName ?? undefined}
        >
          {firstLetter}
        </div>
      )}

      {useStatus && (
        <span
          className={`absolute bottom-0 right-0 border-2 border-foreground/10 rounded-full ${StatusColors[status]}`}
          style={{
            width: numericSize * 0.3,
            height: numericSize * 0.3,
          }}
        />
      )}
    </div>
  );
};
