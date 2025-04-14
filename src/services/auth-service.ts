
import { supabase } from "@/integrations/supabase/client";

// Fetch user role and status
export const fetchUserData = async (userId: string) => {
  try {
    console.log("Fetching user data for ID:", userId);
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("role, status")
      .eq("id", userId)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
      return { role: null, status: null };
    }
    
    console.log("User data fetched:", userData);
    return userData;
  } catch (error) {
    console.error("Error in fetchUserData:", error);
    return { role: null, status: null };
  }
};
