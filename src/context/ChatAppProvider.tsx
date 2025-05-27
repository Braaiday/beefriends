import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import useUserPresence from "../hooks/useUserPresence";
import { useFriends } from "../hooks/useFriends";
import { useInvitations } from "../hooks/useInvitations";
import { useChats } from "../hooks/useChats";
import { firestore } from "../firebase/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import type { Invitation } from "../types/Invitation";
import type { Friend } from "../types/Friend";
import type { Chat } from "../types/Chat";
import { useAuth } from "./AuthProvider";

interface ChatAppContextType {
  friends: Friend[];
  friendsCount: number;
  invitations: Invitation[];
  invitationCount: number;
  chats: Chat[];
  chatsLoading: boolean;

  selectedChatId: string | null;
  setSelectedChatId: React.Dispatch<React.SetStateAction<string | null>>;
  startChatWithFriend: (
    friendUid: string,
    friendName: string,
    friendPhotoURL: string
  ) => Promise<string | null>;
}

const ChatAppContext = createContext<ChatAppContextType | undefined>(undefined);

interface ChatAppProviderProps {
  children: ReactNode;
}

export const ChatAppProvider: React.FC<ChatAppProviderProps> = ({
  children,
}) => {
  useUserPresence();
  const { friends, friendsCount } = useFriends();
  const { invitations, invitationCount } = useInvitations();
  const { chats, loading: chatsLoading } = useChats();
  const { user } = useAuth();
  const userId = user?.uid;

  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const startChatWithFriend = async (
    friendUid: string,
    friendName: string,
    friendPhotoURL: string
  ): Promise<string | null> => {
    if (!userId) return null;

    const chatsRef = collection(firestore, "chats");

    const q = query(
      chatsRef,
      where("type", "==", "private"),
      where("participants", "array-contains", userId)
    );

    const querySnapshot = await getDocs(q);

    const existingChat = querySnapshot.docs.find((doc) => {
      const data = doc.data();
      const participants: string[] = data.participants;
      return (
        participants.length === 2 &&
        participants.includes(userId) &&
        participants.includes(friendUid)
      );
    });

    if (existingChat) {
      setSelectedChatId(existingChat.id);
      return existingChat.id;
    }

    const newChatDoc = await addDoc(chatsRef, {
      participants: [userId, friendUid],
      friendlyNames: {
        [user.uid]: user.displayName,
        [friendUid]: friendName,
      },
      photoURLs: {
        [user.uid]: user.photoURL,
        [friendUid]: friendPhotoURL,
      },
      type: "private",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null,
    });

    setSelectedChatId(newChatDoc.id);
    return newChatDoc.id;
  };

  return (
    <ChatAppContext.Provider
      value={{
        friends,
        friendsCount,
        invitations,
        invitationCount,
        chats,
        chatsLoading,
        selectedChatId,
        setSelectedChatId,
        startChatWithFriend,
      }}
    >
      {children}
    </ChatAppContext.Provider>
  );
};

export const useChatApp = (): ChatAppContextType => {
  const context = useContext(ChatAppContext);
  if (!context) {
    throw new Error("useChatApp must be used within a ChatAppProvider");
  }
  return context;
};
