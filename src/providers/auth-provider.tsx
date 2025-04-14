
import { useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import AuthContext from "@/contexts/auth-context";
import { fetchUserData } from "@/services/auth-service";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // First get current session
    const initAuth = async () => {
      try {
        console.log("AuthProvider: Initial session check");
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("AuthProvider: Found existing session:", session.user.id);
          setUser(session.user);
          
          // Fetch user role and status
          const userData = await fetchUserData(session.user.id);
          setUserRole(userData?.role || null);
          setUserStatus(userData?.status || null);
        } else {
          console.log("AuthProvider: No existing session");
          setUser(null);
          setUserRole(null);
          setUserStatus(null);
        }
      } catch (error) {
        console.error("AuthProvider: Error during initialization:", error);
      } finally {
        console.log("AuthProvider: Initialization complete, setting loading=false");
        setLoading(false);
      }
    };

    // Initialize auth state
    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          
          // Fetch user data in a non-blocking way to avoid race conditions
          setTimeout(async () => {
            const userData = await fetchUserData(session.user.id);
            setUserRole(userData?.role || null);
            setUserStatus(userData?.status || null);
          }, 0);
        } else {
          setUser(null);
          setUserRole(null);
          setUserStatus(null);
        }
      }
    );

    // Cleanup on unmount
    return () => {
      console.log("AuthProvider: Unmounting, cleaning up subscription");
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("SignIn: Attempting login for:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("SignIn: Error during login:", error.message);
        toast({
          title: "Errore di accesso",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log("SignIn: Login successful, user:", data.user?.id);
      
      // If we got here, login was successful
      if (data.user) {
        // Show success toast
        toast({
          title: "Accesso effettuato",
          description: "Benvenuto in Trainecta",
        });
        
        // Note: The auth state change listener will handle updating the user,
        // role, and status in the state
        console.log("SignIn: Auth state change will handle the rest");
      }
    } catch (error: any) {
      console.error("SignIn: Caught error:", error.message);
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'accesso",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      });

      if (error) {
        toast({
          title: "Errore di registrazione",
          description: error.message,
          variant: "destructive",
        });
        return { user: null, error };
      }

      return { user: data.user, error: null };
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Errore durante la registrazione",
        variant: "destructive",
      });
      return { user: null, error };
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out user");
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error: any) {
      console.error("Error during sign out:", error);
      toast({
        title: "Errore",
        description: error.message || "Errore durante il logout",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ 
      signIn, 
      signUp, 
      signOut, 
      loading, 
      user, 
      userRole,
      userStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
};
