import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Avatar } from "./Avatar";

export const Settings = () => {
  const { user } = useAuth();

  const { logout } = useAuth();

  const navigate = useNavigate();

  return (
    <Menu as="div" className="relative">
      <MenuButton
        className="p-2 rounded-full hover:cursor-pointer"
        title="Settings"
      >
        <Avatar url={user?.photoURL} displayName={user?.displayName} />
      </MenuButton>

      <MenuItems className="absolute left-0 mt-4 w-60 h-96 origin-top-left bg-card border border-border rounded-md shadow-md z-50 focus:outline-none flex flex-col">
        <div className="py-1">
          <MenuItem>
            {() => (
              <button
                onClick={() => navigate("settings")}
                className={`cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-primary/20`}
              >
                Account Settings
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {() => (
              <button
                onClick={async () => await logout()}
                className={`cursor-pointer w-full text-left px-4 py-2 text-sm hover:bg-primary/20`}
              >
                Logout
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};
