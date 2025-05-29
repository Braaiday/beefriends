import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Avatar } from "./Avatar";
import { Icon } from "@iconify/react";

export const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <Menu as="div" className="relative">
      <MenuButton
        className="p-1 rounded-full hover:ring-2 hover:ring-primary transition"
        title="Settings"
      >
        <Avatar url={user?.photoURL} displayName={user?.displayName} />
      </MenuButton>

      <MenuItems className="absolute left-0 mt-4 w-72 origin-top-left bg-card border border-border rounded-md shadow-lg z-50 p-3 space-y-2 focus:outline-none">
        {/* User Info Header */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-foreground text-left">
              {user?.displayName}
            </p>
            <p className="text-xs text-muted-foreground text-left break-all">
              {user?.email}
            </p>
          </div>
          <button
            onClick={logout}
            className="cursor-pointer p-1 rounded-full  hover:bg-red-300 transition"
            title="Logout"
          >
            <Icon
              icon="solar:logout-2-bold-duotone"
              className="text-red-500 w-5 h-5"
            />
          </button>
        </div>

        <div className="border-t border-border pt-2">
          {/* Profile / Settings MenuItem */}
          <MenuItem>
            {({ active }) => (
              <button
                onClick={() => navigate("settings")}
                className={`cursor-pointer w-full flex items-center gap-2 px-4 py-2 text-sm rounded ${
                  active ? "bg-primary/10 text-primary" : "text-foreground"
                }`}
              >
                <Icon icon="solar:settings-bold-duotone" className="w-4 h-4" />
                <span>Profile</span>
              </button>
            )}
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
};
