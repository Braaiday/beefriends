import { ChatWindow } from "../components/ChatWindow";
import { Sidebar } from "../components/Sidebar";
import { TopBar } from "../components/TopBar";

export const ChatApp = () => {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <ChatWindow />
      </div>
    </div>
  );
};
