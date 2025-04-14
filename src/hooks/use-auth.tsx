
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

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

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userStatus, setUserStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch user role and status
  const fetchUserData = async (userId: string) => {
    try {
      console.log("Fetching user data for ID:", userId);
      const { data, error } = await supabase
        .from("users")
        .select("role, status")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        return { role: null, status: null };
      }
      
      console.log("User data fetched:", data);
      return data;
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      return { role: null, status: null };
    }
  };

  useEffect(() => {
    // Check active sessions and set the user
    const checkUser = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          console.log("Active session found for user:", session.user);
          setUser(session.user);
          const userData = await fetchUserData(session.user.id);
          setUserRole(userData?.role || null);
          setUserStatus(userData?.status || null);
          console.log("User role and status set:", { role: userData?.role, status: userData?.status });
        } else {
          console.log("No active session found");
        }
      } catch (error) {
        console.error("Error checking auth session:", error);
      } finally {
        setLoading(false);
      }
    };

    // Call the function
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("Auth state changed:", { event: _event, user: session?.user });
        setUser(session?.user ?? null);
        if (session?.user) {
          const userData = await fetchUserData(session.user.id);
          setUserRole(userData?.role || null);
          setUserStatus(userData?.status || null);
          console.log("Updated user role and status:", { role: userData?.role, status: userData?.status });
        } else {
          setUserRole(null);
          setUserStatus(null);
        }
        setLoading(false);
      }
    );

    // Cleanup on unmount
    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Errore di accesso",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // The user, role and status will be set by the onAuthStateChange event
      toast({
        title: "Accesso effettuato",
        description: "Benvenuto in Trainecta",
      });
      
      // Navigation will be handled by Dashboard component based on role and status
    } catch (error: any) {
      toast({
        title: "Errore",
        description: error.message || "Errore durante l'accesso",
        variant: "destructive",
      });
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
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error: any) {
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
