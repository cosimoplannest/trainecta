
import { ReactNode, createContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AuthContext from "@/contexts/auth-context";
import { toast } from "@/hooks/use-toast";
import { User, Session } from "@supabase/supabase-js";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);

  // Clean up auth state function
  const cleanupAuthState = () => {
    // Remove standard auth tokens
    localStorage.removeItem('supabase.auth.token');
    // Remove all Supabase auth keys from localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    // Remove from sessionStorage if in use
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };

  // Initialize user data
  useEffect(() => {
    const initializeUserData = async () => {
      try {
        setLoading(true);
        
        // First, set up the auth state listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.info("Auth state changed:", event, session?.user?.id);
            
            if (event === 'SIGNED_IN' && session?.user) {
              setUser(session.user);
              
              // Use setTimeout to defer fetching additional user data
              setTimeout(async () => {
                try {
                  await fetchUserData(session.user.id);
                } catch (error) {
                  console.error("Error fetching user data in auth state change:", error);
                }
              }, 0);
            } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
              setUser(null);
              setUserRole(null);
              setUserStatus(null);
            }
          }
        );

        // Then check for an existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await fetchUserData(session.user.id);
        }
        
        return () => {
          subscription?.unsubscribe();
        };
      } catch (error) {
        console.error("Error in auth initialization:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeUserData();
  }, []);

  // Function to fetch user role and status
  const fetchUserData = async (userId: string) => {
    try {
      console.info("Fetching user data for ID:", userId);
      
      const { data, error } = await supabase
        .from("users")
        .select("role, status")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        return;
      }

      console.info("User data fetched:", data);
      
      if (data) {
        setUserRole(data.role);
        setUserStatus(data.status);
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      // Try to sign out globally first
      try {
        await supabase.auth.signOut({ scope: 'global' });
      } catch (err) {
        // Continue even if this fails
      }
      
      console.log(`Attempting to sign in with email: ${email}`);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      console.log("Sign in successful:", data.user?.id);
      
      // User will be set by onAuthStateChange
      return { user: data.user, session: data.session };
    } catch (error: any) {
      console.error("Sign in error:", error);
      
      // Provide a user-friendly error message
      if (error.message.includes("Invalid login")) {
        throw new Error("Email o password non validi");
      } else {
        throw error;
      }
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // Clean up existing auth state
      cleanupAuthState();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName,
            ...userData,
          },
        },
      });

      if (error) {
        throw error;
      }

      return { user: data.user, error: null };
    } catch (error: any) {
      console.error("Sign up error:", error);
      return { user: null, error };
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      // Clean up auth state
      cleanupAuthState();
      
      await supabase.auth.signOut();
      
      // Force page reload for a clean state
      window.location.href = '/login';
      
      toast({
        title: "Disconnesso",
        description: "Hai effettuato il logout con successo.",
      });
    } catch (error) {
      console.error("Sign out error:", error);
      toast({
        title: "Errore",
        description: "Si è verificato un errore durante il logout.",
        variant: "destructive",
      });
    }
  };

  const value = {
    signIn,
    signUp,
    signOut,
    loading,
    user,
    userRole,
    userStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
