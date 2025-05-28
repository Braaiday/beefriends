import { Menu, MenuButton } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { useChatApp } from "../context/ChatAppProvider";
import { NewChatOrGroupMenuItems } from "./NewChatOrGroupMenuItems";
import { SelectGroupMembers } from "./SelectGroupMembers";
import { useState } from "react";
import type { Friend } from "../types/Friend";
import { SetGroupSettings } from "./SetGroupSettings";

type Screen = "main" | "select-group-members" | "set-group-settings";

export const StartNewChatOrGroup = () => {
  const { friends } = useChatApp();
  const [screen, setScreen] = useState<Screen>("main");
  const [selectedFriends, setSelectedFriends] = useState<Friend[]>([]);

  return (
    <Menu as="div" className="relative">
      {({ close }) => (
        <>
          <MenuButton
            className="p-2 rounded-full hover:bg-primary/10 transition cursor-pointer"
            title="Start Chat"
          >
            <Icon
              icon="solar:document-add-bold-duotone"
              className="w-6 h-6 text-foreground/60 hover:text-primary"
            />
          </MenuButton>

          {screen === "main" && (
            <NewChatOrGroupMenuItems
              friends={friends}
              setScreen={setScreen}
              close={close}
            />
          )}

          {screen === "select-group-members" && (
            <SelectGroupMembers
              friends={friends}
              selectedFriends={selectedFriends}
              setSelectedFriends={setSelectedFriends}
              setScreen={setScreen}
            />
          )}

          {screen === "set-group-settings" && (
            <SetGroupSettings
              selectedFriends={selectedFriends}
              closeMenu={close}
              setScreen={setScreen}
            />
          )}
        </>
      )}
    </Menu>
  );
};
