import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useAuth } from "../context/AuthProvider";
import { useChatApp } from "../context/ChatAppProvider";

interface MessageInputProps {
  chatId: string;
}

const messageSchema = z.object({
  text: z.string().trim().min(1, ""),
});

type MessageFormData = z.infer<typeof messageSchema>;

export const MessageInput = ({ chatId }: MessageInputProps) => {
  const { user } = useAuth();
  const { chats } = useChatApp();
  const chat = chats.find((chat) => chat.id === chatId);
  const { participants, unreadCounts = {} } = chat ?? {
    participants: [],
    unreadCounts: {},
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data: MessageFormData) => {
    if (!user) return;

    const messageData = {
      senderId: user.uid,
      text: data.text.trim(),
      timestamp: serverTimestamp(),
      type: "text",
      seenBy: [user.uid],
    };

    const chatRef = doc(firestore, "chats", chatId);

    // Add message to subcollection
    await addDoc(collection(chatRef, "messages"), messageData);

    // Build new unreadCounts
    const newUnreadCounts: Record<string, number> = {};
    for (const participantId of participants) {
      if (participantId === user.uid) {
        newUnreadCounts[participantId] = 0;
      } else {
        const prev = unreadCounts?.[participantId] ?? 0;
        newUnreadCounts[participantId] = prev + 1;
      }
    }

    // Update parent chat doc
    await updateDoc(chatRef, {
      lastMessage: {
        text: messageData.text,
        senderId: messageData.senderId,
        timestamp: serverTimestamp(),
      },
      updatedAt: serverTimestamp(),
      unreadCounts: newUnreadCounts,
    });

    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 border-t border-border flex gap-2"
    >
      <div className="flex-1">
        <input
          type="text"
          placeholder="Type a message..."
          {...register("text")}
          className="w-full rounded-l px-4 py-2 border border-border focus:outline-none"
        />
        {errors.text && (
          <p className="text-sm text-destructive mt-1">{errors.text.message}</p>
        )}
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-primary text-primary-foreground px-4 py-2 rounded-r hover:opacity-90 disabled:opacity-50"
      >
        Send
      </button>
    </form>
  );
};
