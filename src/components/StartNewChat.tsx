import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { useChatApp } from "../context/ChatAppProvider";
import { FriendListItem } from "./FriendListItem";

// Zod schema
const SearchSchema = z.object({
  query: z.string().max(100).optional(),
});

type SearchFormData = z.infer<typeof SearchSchema>;

export const StartNewChat = () => {
  const { friends } = useChatApp();

  const {
    register,
    watch,
    formState: { errors },
  } = useForm<SearchFormData>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      query: "",
    },
  });

  const searchQuery = watch("query") || "";

  const filteredFriends = friends.filter((friend) =>
    friend.friendName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Menu as="div" className="relative">
      <MenuButton
        className="p-2 rounded-full hover:bg-primary/10 transition cursor-pointer"
        title="Start Chat"
      >
        <Icon
          icon="solar:document-add-bold-duotone"
          className="w-6 h-6 text-foreground/60 hover:text-primary"
        />
      </MenuButton>

      <MenuItems className="absolute left-0 mt-4 w-72 origin-top-left bg-card border border-border rounded-md shadow-md z-50 focus:outline-none">
        <div className="p-3">
          <div className="mb-2 text-sm font-semibold text-muted-foreground">
            New chat
          </div>

          <input
            type="text"
            placeholder="Search friends..."
            className="w-full p-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
            {...register("query")}
          />
          {errors.query && (
            <p className="text-xs text-red-500 mt-1">{errors.query.message}</p>
          )}
        </div>

        <div className="max-h-60 overflow-y-auto px-2 pb-2">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((friend) => (
              <FriendListItem friend={friend} key={friend.friendUid} />
            ))
          ) : (
            <div className="text-center text-sm text-muted-foreground py-4">
              No friends found
            </div>
          )}
        </div>
      </MenuItems>
    </Menu>
  );
};
