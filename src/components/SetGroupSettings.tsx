import { MenuItems } from "@headlessui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Friend } from "../types/Friend";
import type { Dispatch, SetStateAction } from "react";
import { Avatar } from "./Avatar";
import { Icon } from "@iconify/react";
import { cn } from "../lib/utils";
import { useState } from "react";
import { useChatApp } from "../context/ChatAppProvider";

const GroupSchema = z.object({
  name: z.string().min(1, "Group name is required"),
});

type FormData = z.infer<typeof GroupSchema>;

interface Props {
  selectedFriends: Friend[];
  closeMenu: () => void;
  setScreen: Dispatch<
    SetStateAction<"main" | "select-group-members" | "set-group-settings">
  >;
}

export const SetGroupSettings = ({
  selectedFriends,
  closeMenu,
  setScreen,
}: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(GroupSchema),
  });

  const [loading, setLoading] = useState(false);

  const { startGroupChat } = useChatApp();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const groupId = await startGroupChat(data.name, selectedFriends);
      console.log("Created group with ID:", groupId);
      closeMenu();
      setScreen("main");
    } catch (error) {
      console.error("Failed to create group:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MenuItems
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      className="absolute left-0 mt-4 w-72 h-120 origin-top-left bg-card border border-border rounded-md shadow-md z-50 focus:outline-none flex flex-col"
    >
      {/* Header and input */}
      <div className="flex-shrink-0 px-3 pt-3">
        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground text-left">
          <Icon
            icon="solar:arrow-left-bold-duotone"
            className="w-6 h-6 text-foreground/60 hover:text-primary cursor-pointer"
            onClick={() => setScreen("select-group-members")}
          />
          New Group
        </div>

        <input
          type="text"
          placeholder="Group name"
          className="w-full p-2 text-sm bg-background border border-border rounded-md"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Scrollable friend list */}
      <ul className="flex-1 overflow-y-auto px-3 mt-2">
        {selectedFriends.map((friend) => (
          <li
            key={friend.friendUid}
            className="flex items-center gap-3 px-3 py-2"
          >
            <Avatar
              url={friend.friendPhotoURL}
              displayName={friend.friendName}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{friend.friendName}</span>
            </div>
          </li>
        ))}
      </ul>

      {/* Footer with submit button */}
      <div className="flex justify-end px-3 py-3 flex-shrink-0 border-t border-border">
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "cosmic-button w-full flex items-center justify-center gap-2",
            loading ? "cursor-not-allowed opacity-70" : ""
          )}
        >
          {loading && (
            <svg
              className="w-5 h-5 text-white animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          )}
          {loading ? "Creating..." : "Create Group"}
        </button>
      </div>
    </MenuItems>
  );
};
