import { collection, orderBy, query, where } from "firebase/firestore";
import { firestore } from "../firebase/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import type { SearchFriend } from "../types/SearchFriend";

export function useSearchFriends(queryString: string) {
  const isEmptyQuery = queryString === "";

  const chatsQuery = query(
    collection(firestore, "userProfiles"),
    where("displayName", ">=", queryString),
    where("displayName", "<=", queryString + "\uf8ff"),
    orderBy("createdAt", "desc")
  );

  const [snapshot, loading, error] = useCollection(chatsQuery);

  const searchResult: SearchFriend[] =
    snapshot?.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        displayName: data.displayName,
        photoURL: data.photoURL,
        createdAt: data.createdAt?.toDate?.() ?? new Date(0),
      };
    }) ?? [];

  return {
    searchResults: isEmptyQuery ? [] : searchResult || [],
    searchLoading: isEmptyQuery ? false : loading,
    searchError: isEmptyQuery ? null : error,
    searchEmpty: isEmptyQuery ? true : !loading && searchResult?.length === 0,
  };
}
