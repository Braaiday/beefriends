import { useAuth } from "../context/AuthProvider";
import { useChatApp } from "../context/ChatAppProvider";
import { useUserStatus } from "../hooks/useUserStatus";
import type { Chat } from "../types/Chat";
import { Avatar } from "./Avatar";
import { formatDistanceToNow } from "date-fns";
import { GroupAvatarCluster } from "./GroupAvatarCluster";

interface FriendListItemProps {
  chat: Chat;
}

export const ChatListItem = ({ chat }: FriendListItemProps) => {
  const { user } = useAuth();
  const { selectedChatId, setSelectedChatId, setSelectedChat } = useChatApp();

  const isGroup = chat.type === "group";
  const friendId = chat.participants.find((id) => id !== user?.uid) ?? null;

  const status = useUserStatus(friendId) || "offline";

  if (!user?.uid) return null;

  const chatName = isGroup
    ? chat.name || "Unnamed Group"
    : chat.friendlyNames[friendId ?? ""] || "Unknown";

  const photoUrl = isGroup ? chat.avatarUrl : chat.photoURLs[friendId ?? ""];

  const lastMsg = chat.lastMessage;
  const timeAgo = lastMsg
    ? formatDistanceToNow(new Date(lastMsg.timestamp), {
        addSuffix: true,
      })
    : "";

  const typingUserIds = chat.typingUsers?.filter((id) => id !== user.uid) ?? [];

  const typingNames = typingUserIds
    .map((id) => chat.friendlyNames?.[id])
    .filter(Boolean); // remove undefined/null

  const unreadCount = chat.unreadCounts?.[user.uid] ?? 0;

  // For private chats, only show if the user is a participant and not a draft
  if (!isGroup && !lastMsg && chat.createdBy !== user.uid) return null;

  return (
    <div
      key={chat.id}
      className={`flex gap-3 p-2 rounded-md hover:bg-primary/70 cursor-pointer transition ${
        chat.id === selectedChatId ? "bg-primary/10" : ""
      }`}
      title={chatName}
      onClick={() => {
        setSelectedChatId(chat.id);
        setSelectedChat(chat);
      }}
    >
      {isGroup ? (
        <GroupAvatarCluster
          photoURLs={chat.photoURLs}
          participants={chat.participants}
          friendlyNames={chat.friendlyNames}
        />
      ) : (
        <Avatar
          url={photoUrl}
          displayName={chatName}
          useStatus={!isGroup}
          status={status}
        />
      )}

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
          {typingNames.length > 0 ? (
            <p className="text-xs text-accent font-medium truncate mt-1 text-left text-green-500">
              {typingNames.length === 1
                ? `${typingNames[0]} is typing...`
                : `${typingNames.join(" and ")} are typing...`}
            </p>
          ) : lastMsg ? (
            <p className="text-xs text-muted-foreground truncate mt-1 text-left">
              {lastMsg.senderId === user?.uid ? "You: " : ""}
              {lastMsg.text}
            </p>
          ) : null}

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
