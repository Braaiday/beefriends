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

      <MenuItems className="absolute right-0 mt-2 w-64 origin-top-right bg-card border border-border rounded-md shadow-md z-50 focus:outline-none">
        <div className="py-1">
          <MenuItem>
            {({ active }) => (
              <button
                onClick={() => navigate("settings")}
                className={`w-full text-left px-4 py-2 text-sm ${
                  active ? "bg-primary/10 text-foreground" : "text-foreground"
                }`}
              >
                Account Settings
              </button>
            )}
          </MenuItem>
          <MenuItem>
            {({ active }) => (
              <button
                onClick={async () => await logout()}
                className={`w-full text-left px-4 py-2 text-sm ${
                  active ? "bg-primary/10 text-foreground" : "text-foreground"
                }`}
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
