import { ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import { database } from "../firebase/firebase";

export const useUserStatus = (uid: string) => {
    const [status, setStatus] = useState<"online" | "offline" | null>(null);

    useEffect(() => {
        const statusRef = ref(database, `status/${uid}`);

        const unsubscribe = onValue(statusRef, (snapshot) => {
            const data = snapshot.val();
            setStatus(data?.state || "offline");
        });

        return () => unsubscribe();
    }, [uid]);

    return status;
};