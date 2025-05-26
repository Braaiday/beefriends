import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { ref, onValue, onDisconnect, set } from "firebase/database";
import { database, firestore } from "../firebase/firebase";
import { type User } from "firebase/auth";

export const setupUserPresence = (user: User) => {
  const userStatusDatabaseRef = ref(database, `/status/${user.uid}`);
  const userStatusFirestoreRef = doc(firestore, "status", user.uid);

  const isOfflineForDatabase = {
    state: "offline",
    lastChanged: Date.now(),
    displayName: user.displayName,
    photoURL: user.photoURL ?? '',
  };

  const isOnlineForDatabase = {
    state: "online",
    lastChanged: Date.now(),
    displayName: user.displayName,
    photoURL: user.photoURL ?? '',
  };

  const isOfflineForFirestore = {
    state: "offline",
    lastChanged: serverTimestamp(),
  };

  const isOnlineForFirestore = {
    state: "online",
    lastChanged: serverTimestamp(),
  };

  // Listen to connection state in Realtime DB
  const connectedRef = ref(database, ".info/connected");
  onValue(connectedRef, (snapshot) => {
    if (snapshot.val() === false) {
      // Client is offline (disconnected)
      setDoc(userStatusFirestoreRef, isOfflineForFirestore);
      return;
    }

    // Client is connected to Realtime Database
    onDisconnect(userStatusDatabaseRef)
      .set(isOfflineForDatabase)
      .then(() => {
        set(userStatusDatabaseRef, isOnlineForDatabase);
        setDoc(userStatusFirestoreRef, isOnlineForFirestore);
      });
  });
};
