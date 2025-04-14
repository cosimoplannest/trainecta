
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
    // Check active sessions and set the user
    const checkUser = async () => {
      try {
        console.log("AuthProvider: Checking current session");
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Active session found for user:", session.user.id);
          setUser(session.user);
          
          // Fetch user role and status
          const userData = await fetchUserData(session.user.id);
          setUserRole(userData?.role || null);
          setUserStatus(userData?.status || null);
          console.log("User state set:", { 
            user: session.user.id, 
            role: userData?.role, 
            status: userData?.status 
          });
        } else {
          console.log("No active session found");
          setUser(null);
          setUserRole(null);
          setUserStatus(null);
        }
      } catch (error) {
        console.error("Error checking auth session:", error);
      } finally {
        console.log("Auth initialization complete");
        setLoading(false);
      }
    };

    // Call the function
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", { 
          event: _event, 
          userId: session?.user?.id 
        });
        
        setUser(session?.user ?? null);
        
        if (session?.user) {
          console.log("Fetching user data after auth state change");
          const userData = await fetchUserData(session.user.id);
          setUserRole(userData?.role || null);
          setUserStatus(userData?.status || null);
          console.log("Updated user state:", { 
            role: userData?.role, 
            status: userData?.status 
          });
        } else {
          setUserRole(null);
          setUserStatus(null);
        }
      }
    );

    // Cleanup on unmount
    return () => {
      console.log("Auth provider unmounting, cleaning up subscription");
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
