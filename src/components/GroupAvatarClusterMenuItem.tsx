import { Avatar } from "./Avatar";

interface GroupAvatarClusterMenuItemProps {
  photoURLs: Record<string, string>;
  participants: string[];
  friendlyNames: Record<string, string>;
  maxAvatars?: number;
  showExtraCount?: boolean;
}

export const GroupAvatarClusterMenuItem = ({
  photoURLs,
  participants,
  friendlyNames,
  maxAvatars = 2,
  showExtraCount = true,
}: GroupAvatarClusterMenuItemProps) => {
  const avatarsToShow = participants.slice(0, maxAvatars);
  const extraCount = participants.length - avatarsToShow.length;

  return (
    <div className="relative w-10 h-10">
      {avatarsToShow[1] && (
        <div className="absolute top-0 right-0 z-0">
          <Avatar
            key={avatarsToShow[1]}
            url={photoURLs[avatarsToShow[1]]}
            displayName={friendlyNames[avatarsToShow[1]]}
            size="sm"
          />
        </div>
      )}
      {avatarsToShow[0] && (
        <div className="absolute bottom-0 left-0 z-10">
          <Avatar
            key={avatarsToShow[0]}
            url={photoURLs[avatarsToShow[0]]}
            displayName={friendlyNames[avatarsToShow[0]]}
            size="sm"
          />
        </div>
      )}
      {showExtraCount && extraCount > 0 && (
        <div className="absolute -bottom-1 -right-1 z-20 flex items-center justify-center w-5 h-5 text-[10px] font-semibold rounded-full bg-muted text-muted-foreground ring-2 ring-background bg-background text-primary ">
          +{extraCount}
        </div>
      )}
    </div>
  );
};
