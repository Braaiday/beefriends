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
  updateDoc,
} from "firebase/firestore";

import type { Invitation } from "../types/Invitation";
import type { Friend } from "../types/Friend";
import type { Chat } from "../types/Chat";
import useNotificationListener from "../hooks/useNotificationListener";
import { useAuth } from "../context/AuthProvider";

interface ChatAppContextType {
  friends: Friend[];
  friendsCount: number;
  invitations: Invitation[];
  invitationCount: number;
  chats: Chat[];
  chatsLoading: boolean;

  selectedChatId: string | null;
  selectedChat: Chat | null;
  setSelectedChatId: React.Dispatch<React.SetStateAction<string | null>>;
  setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
  startChatWithFriend: (friend: Friend) => Promise<string | null>;
  startGroupChat: (
    groupName: string,
    members: Friend[]
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
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  useNotificationListener(selectedChatId);

  const startChatWithFriend = async (
    friend: Friend
  ): Promise<string | null> => {
    if (!userId) return null;

    const chatsRef = collection(firestore, "chats");

    const q = query(
      chatsRef,
      where("type", "==", "private"),
      where("participants", "array-contains", userId)
    );

    const querySnapshot = await getDocs(q);

    const existingChatDoc = querySnapshot.docs.find((doc) => {
      const data = doc.data();
      const participants: string[] = data.participants;
      return (
        participants.length === 2 &&
        participants.includes(userId) &&
        participants.includes(friend.friendUid)
      );
    });

    if (existingChatDoc) {
      const data = existingChatDoc.data();

      if (!data.lastMessage && data.createdBy !== userId) {
        await updateDoc(existingChatDoc.ref, {
          createdBy: userId,
          updatedAt: serverTimestamp(),
        });
      }

      setSelectedChatId(existingChatDoc.id);
      setSelectedChat({ id: existingChatDoc.id, ...data } as Chat);

      return existingChatDoc.id;
    }

    const newChatDoc = await addDoc(chatsRef, {
      createdBy: userId,
      participants: [userId, friend.friendUid],
      friendlyNames: {
        [user.uid]: user.displayName,
        [friend.friendUid]: friend.friendName,
      },
      photoURLs: {
        [user.uid]: user.photoURL,
        [friend.friendUid]: friend.friendPhotoURL,
      },
      type: "private",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null,
    });

    setSelectedChatId(newChatDoc.id);
    return newChatDoc.id;
  };

  const startGroupChat = async (
    groupName: string,
    members: Friend[]
  ): Promise<string | null> => {
    if (!userId) return null;

    const chatsRef = collection(firestore, "chats");

    const participantIds = [userId, ...members.map((f) => f.friendUid)];

    const friendlyNames = {
      [user.uid]: user.displayName ?? "",
      ...Object.fromEntries(members.map((f) => [f.friendUid, f.friendName])),
    };

    const photoURLs = {
      [user.uid]: user.photoURL ?? "",
      ...Object.fromEntries(
        members.map((f) => [f.friendUid, f.friendPhotoURL])
      ),
    };

    const newGroupChat = await addDoc(chatsRef, {
      createdBy: userId,
      participants: participantIds,
      friendlyNames,
      photoURLs,
      type: "group",
      name: groupName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMessage: null,
    });

    setSelectedChatId(newGroupChat.id);

    setSelectedChat({
      id: newGroupChat.id,
      createdBy: userId,
      participants: participantIds,
      friendlyNames,
      photoURLs,
      type: "group",
      name: groupName,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessage: null,
    });

    return newGroupChat.id;
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
        selectedChat,
        setSelectedChatId,
        setSelectedChat,
        startChatWithFriend,
        startGroupChat,
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
