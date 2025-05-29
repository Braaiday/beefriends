import { useChatApp } from "../context/ChatAppProvider";
import { ChatListItem } from "./ChatListItem";
import { Settings } from "./Settings";
import { StartNewChatOrGroup } from "./StartNewChatOrGroup";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useAuth } from "../context/AuthProvider";

// Zod schema
const searchSchema = z.object({
  search: z.string().optional(),
});

export const Sidebar = () => {
  const { user } = useAuth();

  const { chats, chatsLoading } = useChatApp();

  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(searchSchema),
    defaultValues: { search: "" },
  });

  const search = watch("search")?.toLowerCase() || "";

  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      const friendId = chat.participants.find((id) => id !== user?.uid) ?? null;
      const isGroup = chat.type === "group";
      const chatName = isGroup
        ? chat.name || "Unnamed Group"
        : chat.friendlyNames[friendId ?? ""] || "Unknown";

      return chatName?.toLowerCase().includes(search);
    });
  }, [chats, search, user?.uid]);

  return (
    <aside className="relative w-72 bg-card border-r border-border p-4 flex flex-col overflow-visible max-h-screen space-y-4">
      {/* Header with Settings and StartNewChatOrGroup */}
      <div className="flex justify-between items-center">
        <Settings />
        <StartNewChatOrGroup />
      </div>

      {/* Search Input with Icon */}
      <div className="relative">
        <Icon
          icon="solar:magnifer-outline"
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          width={20}
          height={20}
        />
        <input
          type="text"
          placeholder="Search chats..."
          className="w-full pl-10 p-2 rounded border border-border bg-background text-foreground"
          {...register("search")}
        />
        {errors.search && (
          <p className="text-red-500 text-sm">{errors.search.message}</p>
        )}
      </div>

      {/* Loading Skeleton */}
      {chatsLoading && (
        <>
          {[...Array(12)].map((_, i) => (
            <div key={i} className="animate-pulse flex space-x-6 items-center">
              <div className="w-12 h-12 rounded-full bg-background" />
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-background rounded w-3/4" />
                <div className="h-3 bg-background rounded w-1/2" />
              </div>
            </div>
          ))}
        </>
      )}

      {/* Filtered Chat List */}
      {!chatsLoading && (
        <>
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <ChatListItem chat={chat} key={chat.id} />
            ))
          ) : search ? (
            <div className="text-center mt-4 px-2">
              <p className="text-sm text-muted mb-2">
                <strong>Results (0)</strong>
              </p>
              <div className="bg-background border border-border rounded-lg p-4 shadow-sm">
                <p className="text-sm text-muted-foreground">
                  No chats found for <strong>"{search}"</strong>.<br />
                  Try checking for typos or searching with a different name.
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted text-center mt-4">
              No chats available.
            </p>
          )}
        </>
      )}
    </aside>
  );
};
