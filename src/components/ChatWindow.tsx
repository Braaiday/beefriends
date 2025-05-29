import { useEffect, useRef, useCallback } from "react";
import { useChatApp } from "../context/ChatAppProvider";
import { useMessages } from "../hooks/useMessages";
import { MessageInput } from "./MessageInput";
import { MessageChip } from "./MessageChip";
import { MessageSkeleton } from "./MessageSkeleton";

export const ChatWindow = () => {
  const { selectedChatId } = useChatApp();
  const { messages, loading, loadOlderMessages, loadingMore, hasMore } =
    useMessages(selectedChatId);

  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const isLoadingMoreRef = useRef(false);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isLoadingMoreRef.current) {
      isLoadingMoreRef.current = false;
      return;
    }

    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handle scroll to top to load older messages
  const SCROLL_TOP_THRESHOLD = 150;

  const onScroll = useCallback(() => {
    const container = messagesContainerRef.current;
    if (!container || loadingMore || !hasMore) return;

    if (container.scrollTop <= SCROLL_TOP_THRESHOLD) {
      isLoadingMoreRef.current = true;

      const prevScrollHeight = container.scrollHeight;

      loadOlderMessages().then(() => {
        // Wait for the DOM to update
        requestAnimationFrame(() => {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeight;
          isLoadingMoreRef.current = false;
        });
      });
    }
  }, [loadOlderMessages, loadingMore, hasMore]);

  return (
    <main className="flex-1 flex flex-col overflow-hidden bg-background">
      <div
        className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
        id="chat-messages"
        ref={messagesContainerRef}
        onScroll={onScroll}
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

        {loadingMore && (
          <>
            {[...Array(6)].map((_, i) => (
              <MessageSkeleton key={i} isCurrentUser={i % 2 === 0} />
            ))}
          </>
        )}

        {messages.map((message) => (
          <MessageChip key={message.id} message={message} />
        ))}

        <div ref={bottomRef} />
      </div>

      <MessageInput chatId={selectedChatId} />
    </main>
  );
};
