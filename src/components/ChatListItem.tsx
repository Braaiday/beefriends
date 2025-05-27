import { useAuth } from "../context/AuthProvider";
import { useChatApp } from "../context/ChatAppProvider";
import { useUserProfile } from "../hooks/useUserProfile";
import { useUserStatus } from "../hooks/useUserStatus";
import type { Chat } from "../types/Chat";
import { Avatar } from "./Avatar";
import { formatDistanceToNow } from "date-fns";

interface FriendListItemProps {
  chat: Chat;
}

export const ChatListItem = ({ chat }: FriendListItemProps) => {
  const { user } = useAuth();
  const { selectedChatId, setSelectedChatId } = useChatApp();

  const friendsId = chat?.participants?.find((id) => id !== user?.uid) ?? null;

  const status = useUserStatus(friendsId) || "offline";

  const { userProfiles } = useUserProfile(friendsId);

  const lastMsg = chat.lastMessage;

  // Format time like "5 minutes ago"
  const timeAgo = lastMsg
    ? formatDistanceToNow(new Date(lastMsg.timestamp), {
        addSuffix: true,
      })
    : "";

  // Derive display name
  let chatName = chat.name;
  if (chat.type === "private") {
    const otherIndex = chat.participants.findIndex((p) => p !== user?.uid);
    chatName = chat.friendlyNames[otherIndex] || "Unnamed Chat";
  }

  const friendProfile = userProfiles?.[0];

  if (friendProfile) {
    chatName = friendProfile?.displayName ?? "Unknown";
  }

  const photoUrl = friendProfile?.photoURL ?? "";

  if (!user?.uid) return null;
  const unreadCount = chat.unreadCounts?.[user?.uid] ?? 0;

  return (
    <div
      key={chat.id}
      className={`flex gap-3 p-2 rounded-md hover:bg-primary/70 cursor-pointer transition ${
        chat.id === selectedChatId ? "bg-primary/10" : ""
      }`}
      title={chatName}
      onClick={() => setSelectedChatId(chat.id)}
    >
      <Avatar
        url={photoUrl}
        displayName={chatName}
        useStatus={true}
        status={status}
      />

      <div className="flex flex-col flex-1 min-w-0">
        <div className="flex justify-between items-center gap-2 mb-1.5">
          <h3 className="text-sm font-semibold text-foreground truncate">
            {chatName}
          </h3>
          {timeAgo && (
            <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
              {timeAgo}
            </span>
          )}
        </div>

        <div className="flex justify-between items-center gap-2">
          {lastMsg && (
            <p className="text-xs text-muted-foreground truncate mt-1 text-left">
              {lastMsg.senderId === user?.uid ? "You: " : ""}
              {lastMsg.text}
            </p>
          )}
          {unreadCount > 0 && (
            <span
              className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-2 text-xs font-semibold text-white bg-primary/60 rounded-full"
              title={`${unreadCount} unread messages`}
            >
              {unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
