import { ThemeToggle } from "./ThemeToggle";
import { AddFriend } from "./AddFriend";
import { Notifications } from "./Notifications";

export const TopBar = () => {
  return (
    <div className="h-14 bg-card border-b border-border flex items-center px-4">
      <div className="flex items-center space-x-2 ml-auto">
        <Notifications />
        <AddFriend />
        <ThemeToggle />
      </div>
    </div>
  );
};
