import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  getDocs,
  QueryDocumentSnapshot,
  type DocumentData,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import type { Message } from "../types/Message";
import { useAuth } from "../context/AuthProvider";
import { sleep } from "../utils/sleep";

const PAGE_SIZE = 30;

export const useMessages = (chatId: string | null) => {
  const { user } = useAuth();
  const userId = user?.uid;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  useEffect(() => {
    if (!chatId) return;

    setLoading(true);

    // Query for the last PAGE_SIZE messages ordered by createdAt desc
    const messagesRef = collection(firestore, "chats", chatId, "messages");
    const q = query(
      messagesRef,
      orderBy("timestamp", "desc"),
      limit(PAGE_SIZE)
    );

    // Real-time subscription
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setMessages([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      // snapshot.docs are ordered newest first, reverse to oldest first
      const msgs = snapshot.docs
        .map((doc) => ({
          ...(doc.data() as Message),
          id: doc.id,
          timestamp: doc.data().timestamp?.toDate?.() ?? new Date(0),
        }))
        .reverse();

      setMessages(msgs);

      // Save last document for pagination (oldest in current batch)
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      setHasMore(snapshot.docs.length === PAGE_SIZE);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  // Side effect: Mark unseen messages as seen
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

  // Side effect: Reset unread count
  useEffect(() => {
    if (!userId || !chatId) return;

    const chatRef = doc(firestore, "chats", chatId);
    updateDoc(chatRef, {
      [`unreadCounts.${userId}`]: 0,
    }).catch((err) => {
      console.error("Failed to reset unread count:", err);
    });
  }, [messages, chatId, userId]);

  // Function to load older messages on scroll up
  const loadOlderMessages = useCallback(async () => {
    if (!chatId || !lastDoc || loadingMore || !hasMore) return;

    setLoadingMore(true);

    const messagesRef = collection(firestore, "chats", chatId, "messages");

    // Query older messages before lastDoc, still ordered desc, limit PAGE_SIZE
    const olderQuery = query(
      messagesRef,
      orderBy("timestamp", "desc"),
      startAfter(lastDoc),
      limit(PAGE_SIZE)
    );

    const snapshot = await getDocs(olderQuery);

    if (!snapshot.empty) {
      const olderMsgs = snapshot.docs
        .map((doc) => ({
          ...(doc.data() as Message),
          id: doc.id,
          timestamp: doc.data().timestamp?.toDate?.() ?? new Date(0),
        }))
        .reverse();

      setMessages((prev) => [...olderMsgs, ...prev]); // prepend older messages

      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
    } else {
      setHasMore(false);
    }

    await sleep(1000);
    setLoadingMore(false);
  }, [chatId, lastDoc, loadingMore, hasMore]);

  return { messages, loading, loadOlderMessages, loadingMore, hasMore };
};
