import { useCollection } from "react-firebase-hooks/firestore";
import { collection, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useAuth } from "../context/AuthProvider";
import type { Invitation } from "../types/Invitation";

export const useInvitations = () => {
  const { user } = useAuth();
  const userId = user?.uid;

  const invitationsQuery = query(
    collection(firestore, "friendships"),
    where("participants", "array-contains", userId),
    where("status", "==", "pending")
  );

  const [snapshot, loading, error] = useCollection(
    user ? invitationsQuery : null
  );

  const invitations: Invitation[] =
    snapshot?.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        createdAt: data.createdAt?.toDate?.() ?? new Date(0),
        participants: data.participants,
        status: data.status,
        initiatedBy: data.initiatedBy,
        friendlyNames: data.friendlyNames,
        photoURLs: data.photoURLs,
      } as Invitation;
    }) ?? [];

  const invitationCount = invitations.filter(
    (inv) => inv.initiatedBy !== user?.uid
  ).length;

  return {
    invitations,
    invitationCount,
    loading,
    error,
  };
};
