import { ThemeToggle } from "./ThemeToggle";
import { AddFriend } from "./AddFriend";
import { Notifications } from "./Notifications";
import { ChatUsers } from "./ChatUsers";

export const TopBar = () => {
  return (
    <div className="h-14 bg-card border-b border-border flex items-center px-4">
      <div className="flex items-center space-x-2">
        <ChatUsers />
      </div>

      <div className="flex-grow" />

      <div className="flex items-center space-x-2">
        <AddFriend />
        <Notifications />
        <ThemeToggle />
      </div>
    </div>
  );
};
