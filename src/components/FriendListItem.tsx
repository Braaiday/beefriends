import { useChatApp } from "../context/ChatAppProvider";
import { useUserStatus } from "../hooks/useUserStatus";
import { StatusColors } from "../types/StatusColors";
import { Avatar } from "./Avatar";

interface ProcessedFriend {
  friendUid: string;
  friendName: string;
}

interface FriendListItemProps {
  friend: ProcessedFriend;
}

export const FriendListItem = ({ friend }: FriendListItemProps) => {
  const status = useUserStatus(friend.friendUid) || "offline";
  const { startChatWithFriend } = useChatApp();

  const handleClick = async () => {
    try {
      await startChatWithFriend(friend.friendUid, friend.friendName);
      // Optional: you might want to close a modal or drawer if applicable
    } catch (error) {
      console.error("Failed to start chat:", error);
    }
  };

  return (
    <li
      key={friend.friendUid}
      className="flex items-center gap-3 hover:bg-primary/10 px-3 py-2 rounded-lg cursor-pointer transition-colors"
      onClick={handleClick}
    >
      <Avatar url={null} displayName={friend.friendName} />

      <div className="flex flex-col">
        <span className="text-sm font-medium">{friend.friendName}</span>
        <div className="flex items-center gap-1">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              StatusColors[status] || "bg-gray-400"
            }`}
            aria-label={status}
          />
          <span className="text-xs text-gray-500 capitalize">{status}</span>
        </div>
      </div>
    </li>
  );
};
