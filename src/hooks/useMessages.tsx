import { collection, query, orderBy } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase/firebase";
import type { Message } from "../types/Message";

export const useMessages = (chatId: string | null) => {
  const messagesQuery = chatId
    ? query(
        collection(firestore, "chats", chatId, "messages"),
        orderBy("timestamp", "asc")
      )
    : null;

  const [snapshot, loading, error] = useCollection(messagesQuery);

  const messages: Message[] =
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
    }) ?? [];

  return { messages, loading, error };
};
