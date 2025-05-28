import { collection, orderBy, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase/firebase";
import { useAuth } from "../context/AuthProvider";
import type { Chat } from "../types/Chat";

export const useChats = () => {
  const { user } = useAuth();
  const userId = user?.uid;

  const chatsQuery = query(
    collection(firestore, "chats"),
    where("participants", "array-contains", userId),
    orderBy("updatedAt", "desc")
  );

  const [snapshot, loading, error] = useCollection(user ? chatsQuery : null);

  const chats: Chat[] =
    snapshot?.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        createdBy: data.createdBy,
        participants: data.participants,
        friendlyNames: data.friendlyNames,
        photoURLs: data.photoURLs,
        type: data.type,
        createdAt: data.createdAt?.toDate?.() ?? new Date(0),
        updatedAt: data.updatedAt?.toDate?.() ?? new Date(0),
        lastMessage: data.lastMessage
          ? {
              text: data.lastMessage.text,
              senderId: data.lastMessage.senderId,
              timestamp: data.lastMessage.timestamp?.toDate?.() ?? new Date(0),
            }
          : undefined,
        name: data.name,
        avatarUrl: data.avatarUrl,
        unreadCounts: data.unreadCounts,
        typingUsers: data.typingUsers,
      };
    }) ?? [];

  return { chats, loading, error };
};
