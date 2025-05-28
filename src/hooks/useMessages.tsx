import {
  collection,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { useEffect, useMemo } from "react";
import { firestore } from "../firebase/firebase";
import type { Message } from "../types/Message";
import { useAuth } from "../context/AuthProvider";

export const useMessages = (chatId: string | null) => {
  const { user } = useAuth();
  const userId = user?.uid;

  const messagesQuery = chatId
    ? query(
        collection(firestore, "chats", chatId, "messages"),
        orderBy("timestamp", "asc")
      )
    : null;

  const [snapshot, loading, error] = useCollection(messagesQuery);

  const messages: Message[] = useMemo(() => {
    return (
      snapshot?.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          senderId: data.senderId,
          text: data.text,
          timestamp: data.timestamp?.toDate?.() ?? new Date(0),
          type: data.type,
          seenBy: data.seenBy ?? [],
        };
      }) ?? []
    );
  }, [snapshot]);

  // Side effect to mark unseen messages as seen
  useEffect(() => {
    if (!userId || !chatId || messages.length === 0) return;

    const unseenMessages = messages.filter(
      (msg) => !msg.seenBy.includes(userId)
    );

    unseenMessages.forEach(async (msg) => {
      try {
        const msgRef = doc(firestore, "chats", chatId, "messages", msg.id);
        await updateDoc(msgRef, {
          seenBy: arrayUnion(userId),
        });
      } catch (error) {
        console.error("Error marking message as seen:", error);
      }
    });
  }, [messages, chatId, userId]);

  // Side effect to reset unread count
  useEffect(() => {
    if (!userId || !chatId) return;

    const chatRef = doc(firestore, "chats", chatId);
    updateDoc(chatRef, {
      [`unreadCounts.${userId}`]: 0,
    }).catch((err) => {
      console.error("Failed to reset unread count:", err);
    });
  }, [messages, chatId, userId]);

  return { messages, loading, error };
};
