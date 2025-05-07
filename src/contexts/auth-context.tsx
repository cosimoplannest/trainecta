
import { createContext } from "react";
import { User, Session } from "@supabase/supabase-js";

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<{
    user: User | null;
    session: Session | null;
  } | {
    error: Error;
  }>;
  signUp: (email: string, password: string, userData: any) => Promise<{user: any, error: any}>;
  signOut: () => Promise<void>;
  loading: boolean;
  user: User | null;
  userRole: string | null;
  userStatus: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
