import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthProvider";
import { useChatApp } from "../context/ChatAppProvider";
import { useMessages } from "../hooks/useMessages";
import { MessageInput } from "./MessageInput";
import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { Icon } from "@iconify/react";

export const ChatWindow = () => {
  const { user } = useAuth();
  const { selectedChatId } = useChatApp();
  const { messages, loading } = useMessages(selectedChatId);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user?.uid || !selectedChatId || messages.length === 0) return;

    const unseenMessages = messages.filter(
      (msg) => !msg.seenBy.includes(user.uid)
    );

    unseenMessages.forEach(async (msg) => {
      try {
        const msgRef = doc(
          firestore,
          "chats",
          selectedChatId,
          "messages",
          msg.id
        );
        await updateDoc(msgRef, {
          seenBy: arrayUnion(user.uid),
        });
      } catch (error) {
        console.error("Error marking message as seen:", error);
      }
    });
  }, [messages, selectedChatId, user?.uid]);

  useEffect(() => {
    if (!user?.uid || !selectedChatId) return;

    const chatRef = doc(firestore, "chats", selectedChatId);

    // Set unread count to 0 for this user
    updateDoc(chatRef, {
      [`unreadCounts.${user.uid}`]: 0,
    }).catch((err) => {
      console.error("Failed to reset unread count:", err);
    });
  }, [messages, selectedChatId, user?.uid]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (!selectedChatId) return null;

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Scrollable messages area */}
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

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${
                isCurrentUser ? "items-end" : "items-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg shadow max-w-xs break-words ${
                  isCurrentUser
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-card text-foreground rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>

              {/* Timestamp + double-tick for current user's messages */}
              <div className="flex items-center gap-1 mt-1 select-none">
                <span className="text-xs text-muted-foreground">
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
          );
        })}
        {/* Invisible marker for auto-scrolling */}
        <div ref={bottomRef} />
      </div>

      {/* Message input stays pinned at bottom */}
      <MessageInput chatId={selectedChatId} />
    </main>
  );
};
