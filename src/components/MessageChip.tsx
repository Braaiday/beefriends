import { useAuth } from "../context/AuthProvider";
import { useChatApp } from "../context/ChatAppProvider";
import { Icon } from "@iconify/react";
import { Avatar } from "./Avatar";

import type { Message } from "../types/Message";

interface MessageChipProps {
  message: Message;
}

export const MessageChip = ({ message }: MessageChipProps) => {
  const { user } = useAuth();
  const { selectedChat } = useChatApp();

  const isCurrentUser = message.senderId === user?.uid;
  const messageSeenByOthers = isCurrentUser && message.seenBy.length > 1;
  const senderDisplayName =
    selectedChat?.friendlyNames?.[message.senderId] || "Unknown";
  const senderPhotoURL = selectedChat?.photoURLs?.[message.senderId] || null;

  return (
    <div
      key={message.id}
      className={`flex gap-2 ${
        isCurrentUser ? "justify-end" : "justify-start"
      }`}
    >
      <Avatar url={senderPhotoURL} displayName={senderDisplayName}  />

      <div className="flex flex-col items-start max-w-[75%]">
        <div
          className={`px-4 py-2 rounded-lg shadow break-words ${
            isCurrentUser
              ? "bg-card/20 text-foreground rounded-br-none self-end"
              : "bg-card text-foreground rounded-bl-none"
          }`}
        >
          {message.text}
        </div>

        <div
          className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
            isCurrentUser ? "self-end" : ""
          }`}
        >
          <span>
            {message.timestamp.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isCurrentUser && (
            <Icon
              icon="mdi:check-all"
              width={16}
              className={
                messageSeenByOthers ? "text-blue-500" : "text-gray-400"
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};
