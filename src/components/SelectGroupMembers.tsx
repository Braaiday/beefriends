import { MenuItems } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Friend } from "../types/Friend";
import type { Dispatch, SetStateAction } from "react";
import { Avatar } from "./Avatar";
import { Icon } from "@iconify/react";

type FormData = { query?: string };

const SearchSchema = z.object({
  query: z.string().max(100).optional(),
});

interface Props {
  friends: Friend[];
  selectedFriends: Friend[];
  setSelectedFriends: Dispatch<SetStateAction<Friend[]>>;
  setScreen: Dispatch<
    SetStateAction<"main" | "select-group-members" | "set-group-settings">
  >;
}

export const SelectGroupMembers = ({
  friends,
  selectedFriends,
  setSelectedFriends,
  setScreen,
}: Props) => {
  const { register, watch } = useForm<FormData>({
    resolver: zodResolver(SearchSchema),
    defaultValues: { query: "" },
  });

  const searchQuery = watch("query")?.toLowerCase() || "";

  const filteredFriends = friends.filter((friend) =>
    friend.friendName.toLowerCase().includes(searchQuery)
  );

  const toggleFriend = (friend: Friend) => {
    setSelectedFriends((prev) =>
      prev.some((f) => f.friendUid === friend.friendUid)
        ? prev.filter((f) => f.friendUid !== friend.friendUid)
        : [...prev, friend]
    );
  };

  return (
    <MenuItems
      as="div"
      className="absolute left-0 mt-4 w-72 h-120 origin-top-left bg-card border border-border rounded-md shadow-md z-50 focus:outline-none flex flex-col"
    >
      {/* Fixed Top Section */}
      <div className="p-3 flex-shrink-0">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground text-left">
          <Icon
            icon="solar:arrow-left-bold-duotone"
            className="w-6 h-6 text-foreground/60 hover:text-primary cursor-pointer"
            onClick={() => setScreen("main")}
          />
          New Group
        </div>

        <input
          type="text"
          placeholder="Search friends..."
          className="w-full p-2 text-sm bg-background border border-border rounded-md"
          {...register("query")}
        />

        <div className="mt-3 flex gap-2">
          <div className="flex-1">
            <button
              disabled={selectedFriends.length === 0}
              onClick={() => setScreen("set-group-settings")}
              className="cursor-pointer w-full bg-primary text-foreground text-sm px-3 py-1.5 rounded-md disabled:opacity-50 hover:bg-primary/40"
            >
              Next
            </button>
          </div>
          <div className="flex-1">
            <button
              onClick={() => setScreen("main")}
              className="cursor-pointer w-full bg-background/80 text-foreground text-sm px-3 py-1.5 rounded-md hover:bg-background/40"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Friend List */}
      <ul className="flex-1 overflow-y-auto px-2 pb-2">
        {filteredFriends.map((friend) => {
          const selected = selectedFriends.some(
            (f) => f.friendUid === friend.friendUid
          );
          return (
            <li
              key={friend.friendUid}
              className="flex items-center gap-3 px-3 py-2 hover:bg-primary/10 rounded-lg cursor-pointer"
              onClick={() => toggleFriend(friend)}
            >
              <Avatar
                url={friend.friendPhotoURL}
                displayName={friend.friendName}
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{friend.friendName}</span>
              </div>
              <input
                type="checkbox"
                checked={selected}
                readOnly
                className="
              ml-auto w-5 h-5 appearance-none 
              bg-background/80 border border-border rounded 
              focus:ring-0 transition-colors duration-200 relative
              checked:bg-primary checked:border-primary
              checked:after:content-['✓'] checked:after:text-white 
              checked:after:absolute checked:after:left-[3px] 
              checked:after:top-[-1px] checked:after:text-sm
              hover:border-gray-500
            "
              />
            </li>
          );
        })}
      </ul>
    </MenuItems>
  );
};
