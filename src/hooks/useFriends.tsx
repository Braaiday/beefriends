import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { useMemo } from "react";
import { firestore } from "../firebase/firebase";
import { useAuth } from "../context/AuthProvider";
import type { Friend } from "../types/Friend";

export const useFriends = () => {
  const { user } = useAuth();
  const userId = user?.uid;

  const acceptedFriendsQuery = useMemo(() => {
    if (!userId) return null;
    return query(
      collection(firestore, "friendships"),
      where("participants", "array-contains", userId),
      where("status", "==", "accepted")
    );
  }, [userId]);

  const [snapshot] = useCollection(acceptedFriendsQuery);

  const friends: Friend[] = useMemo(() => {
    if (!userId || !snapshot) return [];

    return snapshot.docs
      .map((doc) => {
        const data = doc.data();

        const otherUid = (data.participants as string[]).find(
          (id) => id !== userId
        );
        if (!otherUid) return null;

        const friendlyNames = data.friendlyNames ?? {};
        const friendlyUrls = data.photoURLs ?? {};

        return {
          id: doc.id,
          friendUid: otherUid,
          friendName: friendlyNames[otherUid] ?? "Unknown",
          friendPhotoURL: friendlyUrls[otherUid] ?? "Unknown",
        };
      })
      .filter((friend): friend is Friend => friend !== null);
  }, [snapshot, userId]);

  return {
    friends,
    friendsCount: friends.length,
  };
};
