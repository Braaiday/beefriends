import { Menu, MenuButton, MenuItems } from "@headlessui/react";
import { Icon } from "@iconify/react";
import { SearchFriendForm } from "./SearchFriendForm";

export const AddFriend = () => {
  return (
    <Menu as="div" className="relative">
      <MenuButton
        className="p-2 rounded-full hover:bg-primary/10 transition relative cursor-pointer"
        title="Friends"
      >
        <Icon
          icon="solar:user-plus-rounded-bold-duotone"
          className="w-6 h-6 text-foreground/60 hover:text-primary"
        />
      </MenuButton>

      <MenuItems className="absolute right-0 mt-4 w-80 origin-top-right bg-card border border-border rounded-md shadow-md z-50 focus:outline-none">
        <SearchFriendForm />
      </MenuItems>
    </Menu>
  );
};
