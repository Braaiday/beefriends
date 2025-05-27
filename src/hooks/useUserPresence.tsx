import { useEffect } from "react";
import {
  ref,
  onDisconnect,
  set,
  serverTimestamp,
  onValue,
  type DatabaseReference,
} from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { auth, database } from "../firebase/firebase";

const useUserPresence = () => {
  useEffect(() => {
    const connectedRef = ref(database, ".info/connected");

    let statusRef: DatabaseReference | null = null;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        statusRef = ref(database, `/status/${uid}`);

        const offlineStatus = {
          state: "offline",
          lastChanged: serverTimestamp(),
        };

        const onlineStatus = {
          state: "online",
          lastChanged: serverTimestamp(),
        };

        // Monitor connection state
        onValue(connectedRef, (snapshot) => {
          if (snapshot.val() === false) {
            return;
          }

          // Set onDisconnect first
          onDisconnect(statusRef!)
            .set(offlineStatus)
            .then(() => {
              // Then set online status
              set(statusRef!, onlineStatus);
            });
        });
      } else if (statusRef) {
        set(statusRef, {
          state: "offline",
          lastChanged: serverTimestamp(),
        });
      }
    });

    return () => unsubscribe();
  }, []);
};

export default useUserPresence;
