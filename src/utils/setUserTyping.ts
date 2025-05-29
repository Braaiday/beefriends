import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { firestore } from "../firebase/firebase";

export const setUserTyping = async (
  chatId: string | null,
  userId: string,
  isTyping: boolean
) => {
  const chatRef = doc(firestore, "chats", chatId ?? "");

  await updateDoc(chatRef, {
    typingUsers: isTyping ? arrayUnion(userId) : arrayRemove(userId),
  });
};
