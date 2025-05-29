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
import { useEffect, useRef } from "react";
import { setUserTyping } from "../utils/setUserTyping";
import { Icon } from "@iconify/react";

interface MessageInputProps {
  chatId: string | null;
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
    setFocus,
    formState: { isSubmitting },
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

    const chatRef = doc(firestore, "chats", chatId ?? "");

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

    // Add a notification for the target user
    const notificationMessage =
      chat?.type === "group"
        ? `You received a new message from ${chat.name}`
        : `${user.displayName} sent you a new message.`;

    await addDoc(collection(firestore, "notifications"), {
      text: notificationMessage,
      participants: participants.filter((p) => p !== user.uid),
      createdAt: serverTimestamp(),
      chatId: chatId,
    });

    reset();
  };

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleTyping = () => {
    if (!user) return;
    setUserTyping(chatId, user.uid, true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setUserTyping(chatId, user.uid, false);
    }, 2000); // 2 seconds of no typing = not typing
  };

  useEffect(() => {
    setFocus("text");
  }, [setFocus, chatId]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-4 border-t border-border flex items-end gap-2 bg-muted/40"
    >
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Type a message..."
          autoComplete="off"
          {...register("text")}
          onChange={(e) => {
            handleTyping();
            register("text").onChange(e);
          }}
          className="w-full rounded-xl px-4 py-2 bg-background focus:ring-2 focus:ring-background focus:outline-none transition-all"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer flex items-center justify-center rounded-xl bg-primary text-primary-foreground p-2 transition hover:opacity-90 disabled:opacity-50"
      >
        <Icon icon="solar:map-arrow-right-bold-duotone" className="w-6 h-6" />
      </button>
    </form>
  );
};
