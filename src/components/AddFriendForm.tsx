import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { Icon } from "@iconify/react";

import { useAuth } from "../context/AuthProvider";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChatApp } from "../context/ChatAppProvider";

const schema = z.object({
  friendDisplayName: z.string().trim().min(1, "Username is required"),
});

type FormData = z.infer<typeof schema>;

export const AddFriendForm = () => {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const { friends } = useChatApp();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    if (!user?.displayName) return;

    setError(null);

    try {
      const q = query(
        collection(firestore, "userProfiles"),
        where("displayName", "==", data.friendDisplayName)
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("No user found with that name.");
        return;
      }

      if (
        friends.some((friend) => friend.friendName === data.friendDisplayName)
      ) {
        setError("You are already friends with that bee.");
        return;
      }

      const userDoc = snapshot.docs[0].data();
      const targetUid = userDoc.uid;

      if (targetUid === user.uid) {
        setError("You can't send a request to yourself.");
        return;
      }

      const sortedParticipants = [user.uid, targetUid].sort();
      await addDoc(collection(firestore, "friendships"), {
        participants: sortedParticipants,
        friendlyNames: {
          [user.uid]: user.displayName,
          [targetUid]: data.friendDisplayName,
        },
        status: "pending",
        initiatedBy: user.uid,
        createdAt: serverTimestamp(),
      });

      reset();
    } catch (err) {
      console.error("Error sending friend request:", err);
      setError("Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-2">
      <div className="flex items-center gap-2">
        <input
          {...register("friendDisplayName")}
          placeholder="Enter username"
          className={`flex-1 px-3 py-2 text-sm rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary transition
            ${
              errors.friendDisplayName
                ? "border-red-500 focus:ring-red-500"
                : ""
            }`}
          aria-invalid={errors.friendDisplayName ? "true" : "false"}
          aria-describedby="friendDisplayName-error"
        />

        <div className="relative group">
          <button
            type="submit"
            disabled={isSubmitting}
            className="p-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Send friend request"
          >
            <Icon icon="solar:user-plus-bold-duotone" className="w-5 h-5" />
          </button>
          <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black text-white text-xs rounded-md py-1 px-2 pointer-events-none transition-opacity duration-200 whitespace-nowrap">
            Send friend request
          </div>
        </div>
      </div>

      {(errors.friendDisplayName || error) && (
        <p
          id="friendDisplayName-error"
          className="mt-1 text-red-500 text-xs"
          role="alert"
        >
          {errors.friendDisplayName?.message || error}
        </p>
      )}
    </form>
  );
};
