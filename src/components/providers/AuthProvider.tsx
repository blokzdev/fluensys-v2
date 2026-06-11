"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { onAuthStateChanged, signOut as fbSignOut, type User } from "firebase/auth";

import {
  getFirebaseAuth,
  isFirebaseConfigured,
  signInAsGuest,
  signInWithGoogle,
} from "@/lib/firebase/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signInGoogle: () => Promise<User | null>;
  signInGuest: () => Promise<User | null>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  configured: false,
  signInGoogle: async () => null,
  signInGuest: async () => null,
  signOut: async () => undefined,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const configured = isFirebaseConfigured();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  const signInGoogle = useCallback(async () => {
    const cred = await signInWithGoogle();
    return cred.user;
  }, []);

  const signInGuest = useCallback(async () => {
    const cred = await signInAsGuest();
    return cred.user;
  }, []);

  const signOut = useCallback(async () => {
    const auth = getFirebaseAuth();
    if (auth) await fbSignOut(auth);
  }, []);

  const value = useMemo(
    () => ({ user, loading, configured, signInGoogle, signInGuest, signOut }),
    [user, loading, configured, signInGoogle, signInGuest, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
