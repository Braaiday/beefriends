import { useChatApp } from "../context/ChatAppProvider";
import { ChatListItem } from "./ChatListItem";

export const Sidebar = () => {
  const { chats, chatsLoading } = useChatApp();

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
        return <ChatListItem chat={chat} />;
      })}
    </aside>
  );
};
