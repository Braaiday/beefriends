import { ChatWindow } from "../components/ChatWindow";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";

export const ChatApp = () => {
  return (
    <div className="h-screen flex">
      {/* Sidebar takes full height */}
      <Sidebar />

      {/* Right section with TopBar and ChatWindow */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <ChatWindow />
      </div>
    </div>
  );
};
