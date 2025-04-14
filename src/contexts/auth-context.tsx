
import { createContext } from "react";

type AuthContextType = {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<{user: any, error: any}>;
  signOut: () => Promise<void>;
  loading: boolean;
  user: any | null;
  userRole: string | null;
  userStatus: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default AuthContext;
