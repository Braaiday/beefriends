import { collection, query, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { firestore } from "../firebase/firebase";
import type { UserProfile } from "../types/UserProfile";

export const useUserProfile = (userId: string | null) => {
  const userProfileQuery = query(
    collection(firestore, "userProfiles"),
    where("uid", "==", userId)
  );

  const [snapshot, loading, error] = useCollection(userProfileQuery);

  const userProfiles: UserProfile[] =
    snapshot?.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        displayName: data.displayName,
        photoURL: data.photoURL,
        createdAt: data.createdAt?.toDate?.() ?? new Date(0),
      };
    }) ?? [];

  return { userProfiles, loading, error };
};
