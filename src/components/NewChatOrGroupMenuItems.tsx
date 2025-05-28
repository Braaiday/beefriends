import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MenuItems } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { FriendListItem } from "./FriendListItem";
import type { Friend } from "../types/Friend";
import type { Dispatch, SetStateAction } from "react";

type Screen = "main" | "select-group-members" | "set-group-settings";

// Zod schema
const SearchSchema = z.object({
  query: z.string().max(100).optional(),
});

type SearchFormData = z.infer<typeof SearchSchema>;

interface NewChatOrGroupMenuItemsProps {
  friends: Friend[];
  close?: () => void;
  setScreen: Dispatch<SetStateAction<Screen>>;
}

export const NewChatOrGroupMenuItems = ({
  friends,
  close,
  setScreen,
}: NewChatOrGroupMenuItemsProps) => {
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
    <MenuItems
      as="div"
      className="absolute left-0 mt-4 w-72 h-96 origin-top-left bg-card border border-border rounded-md shadow-md z-50 focus:outline-none flex flex-col"
    >
      <div className="p-3 flex-shrink-0">
        <div className="mb-2 text-sm font-semibold text-muted-foreground text-left">
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

      <ul className="flex-1 overflow-y-auto px-2 pb-2">
        <li
          className="flex items-center gap-3 hover:bg-primary/10 px-3 py-2 rounded-lg cursor-pointer transition-colors"
          onClick={() => {
            setScreen("select-group-members");
          }}
        >
          <div className="w-8 h-8 flex items-center justify-center bg-background/80 rounded-full">
            <Icon
              icon="mdi:account-multiple"
              className="w-5 h-5 text-foreground/80"
            />
          </div>
          <span className="text-sm font-medium">New Group</span>
        </li>
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => (
            <FriendListItem
              friend={friend}
              key={friend.friendUid}
              onSelect={close}
            />
          ))
        ) : (
          <li className="text-center text-sm text-muted-foreground py-4">
            No friends found
          </li>
        )}
      </ul>
    </MenuItems>
  );
};
