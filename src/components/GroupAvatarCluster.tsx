import { Avatar } from "./Avatar";

interface GroupAvatarClusterProps {
  photoURLs: Record<string, string>;
  participants: string[];
  friendlyNames: Record<string, string>;
  maxAvatars?: number; // how many avatars to show before "+N"
}

export const GroupAvatarCluster = ({
  photoURLs,
  participants,
  friendlyNames,
  maxAvatars = 3,
}: GroupAvatarClusterProps) => {
  // Show up to maxAvatars avatars
  const avatarsToShow = participants.slice(0, maxAvatars);
  const extraCount = participants.length - avatarsToShow.length;

  return (
    <div className="flex -space-x-2">
      {avatarsToShow.map((id) => (
        <Avatar
          key={id}
          url={photoURLs[id]}
          displayName={friendlyNames[id]}
          size="sm"
        />
      ))}
      {extraCount > 0 && (
        <div className="flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full bg-muted text-muted-foreground ring-2 ring-background border-white">
          +{extraCount}
        </div>
      )}
    </div>
  );
};
