import { Avatar } from "./Avatar";

interface GroupAvatarClusterProps {
  photoURLs: Record<string, string>;
  participants: string[];
  friendlyNames: Record<string, string>;
  maxAvatars?: number;
}

export const GroupAvatarCluster = ({
  photoURLs,
  participants,
  friendlyNames,
  maxAvatars = 3,
}: GroupAvatarClusterProps) => {
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
        <div
          className="w-7 h-7 text-xs font-semibold rounded-full bg-muted text-muted-foreground ring-2 ring-background border-white flex items-center justify-center bg-background text-primary "
          title={`+${extraCount} more`}
        >
          +{extraCount}
        </div>
      )}
    </div>
  );
};
