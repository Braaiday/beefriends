import { useEffect, useRef } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useAuth } from "../context/AuthProvider";
import type { Notification } from "../types/Notification";
import { toast } from "../lib/toast";

const useNotificationListener = (selectedChatId: string | null) => {
  const { user } = useAuth();
  const shownNotificationIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!user?.uid) return;

    const now = Timestamp.now();
    const fiveMinutesAgo = Timestamp.fromMillis(now.toMillis() - 5 * 60 * 1000);

    const notificationsQuery = query(
      collection(firestore, "notifications"),
      where("participants", "array-contains", user.uid),
      where("createdAt", ">=", fiveMinutesAgo)
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        const docSnap = change.doc;
        const data = docSnap.data();

        if (shownNotificationIds.current.has(docSnap.id)) return;

        const createdAt: Date = data.createdAt?.toDate?.() ?? new Date(0);

        // Skip if older than 5 minutes (extra check)
        const isRecent = createdAt.getTime() >= Date.now() - 5 * 60 * 1000;
        if (!isRecent) return;

        const notification: Notification = {
          id: docSnap.id,
          text: data.text,
          participants: data.participants,
          chatId: data.chatId,
          createdAt,
        };

        // We do not trigger a notification if the chatId is the same as the chat the user is in.
        if (selectedChatId === null) {
          toast.success(notification.text);
        } else if (selectedChatId !== notification.chatId) {
          toast.success(notification.text);
        }

        // Mark as shown
        shownNotificationIds.current.add(docSnap.id);

        // Update Firestore to mark notification as seen by removing the user from the participants for the notification
        const notificationRef = doc(firestore, "notifications", docSnap.id);
        await updateDoc(notificationRef, {
          participants: (data.participants ?? []).filter(
            (id: string) => id !== user.uid
          ),
        });
      });
    });

    return () => unsubscribe();
  }, [user, selectedChatId]);
};

export default useNotificationListener;
