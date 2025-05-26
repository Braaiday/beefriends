import { useEffect } from 'react';
import {
  getDatabase,
  ref,
  onDisconnect,
  set,
  serverTimestamp,
  onValue,
  type DatabaseReference,
} from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const useUserPresence = () => {
  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const connectedRef = ref(db, '.info/connected');

    let statusRef: DatabaseReference | null = null;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        statusRef = ref(db, `/status/${uid}`);

        const offlineStatus = {
          state: 'offline',
          lastChanged: serverTimestamp(),
        };

        const onlineStatus = {
          state: 'online',
          lastChanged: serverTimestamp(),
        };

        // Monitor connection state
        onValue(connectedRef, (snapshot) => {
          if (snapshot.val() === false) {
            return;
          }

          // Set onDisconnect first
          onDisconnect(statusRef!).set(offlineStatus).then(() => {
            // Then set online status
            set(statusRef!, onlineStatus);
          });
        });
      } else if (statusRef) {
        set(statusRef, {
          state: 'offline',
          lastChanged: serverTimestamp(),
        });
      }
    });

    return () => unsubscribe();
  }, []);
};

export default useUserPresence;
