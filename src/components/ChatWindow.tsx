import { useEffect, useRef } from "react";
import { useChatApp } from "../context/ChatAppProvider";
import { useMessages } from "../hooks/useMessages";
import { MessageInput } from "./MessageInput";
import { MessageChip } from "./MessageChip";
import { MessageSkeleton } from "./MessageSkeleton";

export const ChatWindow = () => {
  const { selectedChatId } = useChatApp();
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
      <div
        className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
        id="chat-messages"
      >
        {loading && (
          <>
            {[...Array(6)].map((_, i) => (
              <MessageSkeleton key={i} isCurrentUser={i % 2 === 0} />
            ))}
          </>
        )}

        {!loading && messages.length === 0 && (
          <div className="text-center text-muted-foreground">
            No messages yet
          </div>
        )}

        {messages.map((message, index) => (
          <MessageChip key={index} message={message} />
        ))}

        <div ref={bottomRef} />
      </div>

      <MessageInput chatId={selectedChatId} />
    </main>
  );
};
