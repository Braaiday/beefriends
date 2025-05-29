import { useAuth } from "../context/AuthProvider";
import { useChatApp } from "../context/ChatAppProvider";
import { useUserStatus } from "../hooks/useUserStatus";
import { StatusColors } from "../types/StatusColors";
import { Avatar } from "./Avatar";
import { GroupAvatarCluster } from "./GroupAvatarCluster";

export const ChatUsers = () => {
  const { user } = useAuth();

  const { selectedChat } = useChatApp();

  const isGroup = selectedChat?.type === "group";
  const friendId =
    selectedChat?.participants.find((id) => id !== user?.uid) ?? null;

  const status = useUserStatus(friendId) || "offline";

  const groupName = isGroup ? selectedChat.name || "Unnamed Group" : "";

  return (
    <>
      {selectedChat?.participants
        .filter((participant) => participant !== user?.uid)
        .map((participant) => {
          const url = selectedChat.photoURLs[participant];
          const displayName = selectedChat.friendlyNames[participant];
          return (
            <>
              {!isGroup && (
                <>
                  <Avatar url={url} displayName={displayName} />

                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{displayName}</span>
                    <div className="flex items-center gap-1">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${
                          StatusColors[status] || "bg-gray-400"
                        }`}
                        aria-label={status}
                      />
                      <span className="text-xs text-gray-500 capitalize">
                        {status}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </>
          );
        })}

      {isGroup && (
        <>
          <span className="text-sm font-medium">{groupName}</span>

          <GroupAvatarCluster
            photoURLs={selectedChat.photoURLs}
            participants={selectedChat.participants}
            friendlyNames={selectedChat.friendlyNames}
            maxAvatars={2}
          />
        </>
      )}
    </>
  );
};
