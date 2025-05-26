import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, database, firestore } from "../firebase/firebase";
import { ref, set } from "firebase/database";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (
    email: string,
    password: string,
    displayName: string
  ) => Promise<void>;
  login: (
    email: string,
    password: string
  ) => Promise<import("firebase/auth").UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Signup function
  const signup = async (
    email: string,
    password: string,
    displayName: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update the displayName on the user profile
    await updateProfile(user, { displayName });

    // Save user info to Firestore 'users' collection
    await setDoc(doc(firestore, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      displayName,
      createdAt: serverTimestamp(),
    });

    // Save to 'userProfiles' collection for public lookup
    await setDoc(doc(firestore, "userProfiles", user.uid), {
      uid: user.uid,
      displayName,
      createdAt: serverTimestamp(),
    });
  };

  // Login function
  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Logout function
  const logout = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const statusRef = ref(database, `/status/${currentUser.uid}`);

      await set(statusRef, {
        state: "offline",
        lastChanged: serverTimestamp(),
      });
    }

    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { user, loading, signup, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
