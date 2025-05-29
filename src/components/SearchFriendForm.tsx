import { useState } from "react";
import { useSearchFriends } from "../hooks/useSearchFriends";
import { useAuth } from "../context/AuthProvider";
import { useChatApp } from "../context/ChatAppProvider";
import { toast } from "../lib/toast";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { Icon } from "@iconify/react";
import { useDebounce } from "../hooks/useDebouce";
import type { SearchFriend } from "../types/SearchFriend";
import { Avatar } from "./Avatar";

export const SearchFriendForm = () => {
  const { user } = useAuth();
  const { friends } = useChatApp();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery);
  const { searchResults, searchLoading, searchError } =
    useSearchFriends(debouncedQuery);

  const handleAddFriend = async (targetUser: SearchFriend) => {
    if (!user?.uid || !targetUser) return;

    if (targetUser.id === user.uid) {
      toast.error("You can't send a request to yourself.");
      return;
    }

    if (friends.some((f) => f.friendName === targetUser.displayName)) {
      toast.error("You're already friends.");
      return;
    }

    try {
      const sortedParticipants = [user.uid, targetUser.id].sort();

      await addDoc(collection(firestore, "friendships"), {
        participants: sortedParticipants,
        friendlyNames: {
          [user.uid]: user.displayName,
          [targetUser.id]: targetUser.displayName,
        },
        photoURLs: {
          [user.uid]: user.photoURL,
          [targetUser.id]: targetUser.photoURL,
        },
        status: "pending",
        initiatedBy: user.uid,
        createdAt: serverTimestamp(),
      });

      await addDoc(collection(firestore, "notifications"), {
        text: `${user.displayName} sent you a friend request.`,
        participants: [targetUser.id],
        createdAt: serverTimestamp(),
        chatId: null,
      });

      toast.success("Friend request sent.");
    } catch (err) {
      console.error("Error adding friend:", err);
      toast.error("Failed to send request.");
    }
  };

  return (
    <div className="p-2">
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search by username"
        className="w-full px-3 py-2 text-sm rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary transition"
      />

      {!searchLoading && searchResults?.length === 0 && debouncedQuery && (
        <div className="w-full text-center mt-4">
          <p className="text-sm text-muted mb-2">
            <strong>Results (0)</strong>
          </p>
          <div className="bg-background border border-border rounded-lg p-4 shadow-sm">
            <p className="text-sm text-muted-foreground">
              No results found for <strong>"{debouncedQuery}"</strong>.<br />
              Try checking for typos or using complete words.
            </p>
          </div>
        </div>
      )}

      {searchError && (
        <p className="text-sm mt-2 text-red-500">Error loading users.</p>
      )}

      <ul className="flex-1 overflow-y-auto px-2 space-y-2 mt-2">
        {!searchLoading &&
          searchResults?.map((userProfile) => {
            return (
              <li
                key={userProfile.id}
                className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border shadow-sm"
              >
                <Avatar
                  url={userProfile.photoURL}
                  displayName={userProfile.displayName}
                />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {userProfile.displayName}
                  </span>
                </div>
                <button
                  onClick={() => handleAddFriend(userProfile)}
                  className="p-1 text-primary cursor-pointer ml-auto hover:text-primary/80 transition"
                  title="Send friend request"
                >
                  <Icon
                    icon="solar:user-plus-bold-duotone"
                    className="w-5 h-5"
                  />
                </button>
              </li>
            );
          })}
      </ul>
    </div>
  );
};
