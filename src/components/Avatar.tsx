import React, { useState } from "react";
import { StatusColors } from "../types/StatusColors";

interface AvatarProps {
  url?: string | null;
  displayName?: string | null;
  size?: number;
  useStatus?: boolean;
  status?: keyof typeof StatusColors;
}

export const Avatar: React.FC<AvatarProps> = ({
  url,
  displayName,
  size = 40,
  useStatus = false,
  status = "offline",
}) => {
  const [imgError, setImgError] = useState(false);
  const firstLetter = displayName?.charAt(0).toUpperCase();
  const fontSize = size * 0.5;

  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      title={displayName ?? ""}
    >
      {url && !imgError ? (
        <img
          src={url}
          alt={displayName ?? ""}
          onError={() => setImgError(true)}
          className="rounded-full object-cover w-full h-full"
          loading="lazy"
        />
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
            width: size * 0.3,
            height: size * 0.3,
          }}
        />
      )}
    </div>
  );
};
