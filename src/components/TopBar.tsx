import { ThemeToggle } from "./ThemeToggle";
import { AddFriend } from "./AddFriend";
import { Settings } from "./Settings";
import { Notifications } from "./Notifications";
import { StartNewChat } from "./StartNewChat";

export const TopBar = () => {
  return (
    <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4">
      <StartNewChat />
      <div className="flex items-center space-x-2">
        <Notifications />
        <AddFriend />
        <Settings />
        <ThemeToggle />
      </div>
    </div>
  );
};
