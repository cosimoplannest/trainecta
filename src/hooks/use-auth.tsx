
import { useContext } from "react";
import AuthContext from "@/contexts/auth-context";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Re-export the provider to maintain backward compatibility
export { AuthProvider } from "@/providers/auth-provider";
