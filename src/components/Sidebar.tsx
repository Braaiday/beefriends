import { useChatApp } from "../context/ChatAppProvider";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "./Avatar";
import { useAuth } from "../context/AuthProvider";

export const Sidebar = () => {
  const { chats, chatsLoading, selectedChatId, setSelectedChatId } =
    useChatApp();

  const { user } = useAuth();

  if (chatsLoading) {
    return (
      <aside className="w-72 bg-card border-r border-border p-4 flex flex-col space-y-2">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse flex space-x-3 items-center">
            <div className="w-12 h-12 rounded-full bg-background" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4  bg-background rounded w-3/4" />
              <div className="h-3  bg-background rounded w-1/2" />
            </div>
          </div>
        ))}
      </aside>
    );
  }

  return (
    <aside className="w-72 bg-card border-r border-border p-4 flex flex-col overflow-y-auto max-h-screen">
      {chats.length === 0 && (
        <p className="text-sm text-muted-foreground">No chats yet</p>
      )}

      {chats.map((chat) => {
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
          const otherIndex = chat.participants.findIndex(
            (p) => p !== user?.uid
          );
          chatName = chat.friendlyNames[otherIndex] || "Unnamed Chat";
        }

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
              url={chat.avatarUrl}
              displayName={chatName}
              highlightBorder={unreadCount > 0}
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
      })}
    </aside>
  );
};
