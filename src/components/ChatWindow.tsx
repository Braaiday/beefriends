import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthProvider";
import { useChatApp } from "../context/ChatAppProvider";
import { useMessages } from "../hooks/useMessages";
import { MessageInput } from "./MessageInput";
import { Icon } from "@iconify/react";
import { Avatar } from "./Avatar";

export const ChatWindow = () => {
  const { user } = useAuth();
  const { selectedChatId, selectedChat } = useChatApp();
  const { messages, loading } = useMessages(selectedChatId);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedChatId) return null;

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-background">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && (
          <p className="text-muted-foreground">Loading messages...</p>
        )}
        {!loading && messages.length === 0 && (
          <p className="text-muted-foreground">No messages yet</p>
        )}

        {messages.map((msg) => {
          const isCurrentUser = msg.senderId === user?.uid;
          const messageSeenByOthers = isCurrentUser && msg.seenBy.length > 1;
          const senderDisplayName =
            selectedChat?.friendlyNames?.[msg.senderId] || "Unknown";
          const senderPhotoURL =
            selectedChat?.photoURLs?.[msg.senderId] || null;

          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <Avatar
                url={senderPhotoURL}
                displayName={senderDisplayName}
                size={32}
              />

              <div className="flex flex-col items-start max-w-[75%]">
                <div
                  className={`px-4 py-2 rounded-lg shadow break-words ${
                    isCurrentUser
                      ? "bg-primary text-primary-foreground rounded-br-none self-end"
                      : "bg-card text-foreground rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>

                <div
                  className={`flex items-center gap-1 mt-1 text-xs text-muted-foreground ${
                    isCurrentUser ? "self-end" : ""
                  }`}
                >
                  <span>
                    {msg.timestamp.toLocaleTimeString([], {
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
        })}

        <div ref={bottomRef} />
      </div>

      <MessageInput chatId={selectedChatId} />
    </main>
  );
};
