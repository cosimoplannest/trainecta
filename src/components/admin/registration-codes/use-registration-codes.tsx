
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { addDays } from "date-fns";

export type RegistrationCode = {
  id: string;
  code: string;
  role: string;
  active: boolean;
  expires_at: string | null;
  created_at: string;
};

export function useRegistrationCodes(
  user: any,
  setCopyCode: (code: string | null) => void
) {
  const [loading, setLoading] = useState(true);
  const [registrationCodes, setRegistrationCodes] = useState<RegistrationCode[]>([]);
  const [gymId, setGymId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  useEffect(() => {
    const fetchUserGymId = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from("users")
          .select("gym_id")
          .eq("id", user.id)
          .single();

        if (error) throw error;
        if (data?.gym_id) {
          setGymId(data.gym_id);
          return data.gym_id;
        }
      } catch (error) {
        console.error("Error fetching user gym ID:", error);
        toast({
          title: "Errore",
          description: "Non è stato possibile recuperare i dati della palestra",
          variant: "destructive",
        });
        return null;
      }
    };

    const fetchRegistrationCodes = async () => {
      setLoading(true);
      const userGymId = await fetchUserGymId();
      
      if (!userGymId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("gym_registration_codes")
          .select("*")
          .eq("gym_id", userGymId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setRegistrationCodes(data || []);
      } catch (error) {
        console.error("Error fetching registration codes:", error);
        toast({
          title: "Errore",
          description: "Non è stato possibile recuperare i codici di registrazione",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrationCodes();
  }, [user]);

  const generateRegistrationCode = () => {
    // Generate a random 6-character alphanumeric code
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";
    
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    
    return code;
  };

  const handleCreateCode = async (
    role: string, 
    expires: boolean, 
    expireDays: number
  ) => {
    if (!gymId || !role) return;
    
    setIsCreating(true);
    
    try {
      const code = generateRegistrationCode();
      
      // Cast the role string to the app_role enum type expected by Supabase
      const newCode = {
        gym_id: gymId,
        code,
        role: role as "admin" | "operator" | "trainer" | "assistant" | "instructor",
        active: true,
        created_by: user?.id,
        expires_at: expires ? new Date(addDays(new Date(), expireDays)).toISOString() : null
      };
      
      const { data, error } = await supabase
        .from("gym_registration_codes")
        .insert(newCode)
        .select()
        .single();

      if (error) throw error;
      
      setRegistrationCodes(prev => [data, ...prev]);
      setCopyCode(code);
      
      toast({
        title: "Codice creato",
        description: "Il codice di registrazione è stato creato con successo",
      });
      
      return true;
    } catch (error) {
      console.error("Error creating registration code:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile creare il codice di registrazione",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  };

  const toggleCodeStatus = async (id: string, currentStatus: boolean) => {
    if (!gymId) return;
    
    setProcessingIds(prev => [...prev, id]);
    
    try {
      const { error } = await supabase
        .from("gym_registration_codes")
        .update({ active: !currentStatus })
        .eq("id", id)
        .eq("gym_id", gymId);

      if (error) throw error;
      
      setRegistrationCodes(prev => 
        prev.map(code => 
          code.id === id ? { ...code, active: !currentStatus } : code
        )
      );
      
      toast({
        title: !currentStatus ? "Codice attivato" : "Codice disattivato",
        description: !currentStatus 
          ? "Il codice di registrazione è stato attivato"
          : "Il codice di registrazione è stato disattivato",
      });
    } catch (error) {
      console.error("Error updating registration code:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile aggiornare lo stato del codice",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => prev.filter(i => i !== id));
    }
  };

  const deleteCode = async (id: string) => {
    if (!gymId) return;
    
    setProcessingIds(prev => [...prev, id]);
    
    try {
      const { error } = await supabase
        .from("gym_registration_codes")
        .delete()
        .eq("id", id)
        .eq("gym_id", gymId);

      if (error) throw error;
      
      setRegistrationCodes(prev => 
        prev.filter(code => code.id !== id)
      );
      
      toast({
        title: "Codice eliminato",
        description: "Il codice di registrazione è stato eliminato",
      });
    } catch (error) {
      console.error("Error deleting registration code:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile eliminare il codice",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => prev.filter(i => i !== id));
    }
  };

  const refreshCode = async (id: string) => {
    if (!gymId) return;
    
    setProcessingIds(prev => [...prev, id]);
    
    try {
      const newCode = generateRegistrationCode();
      
      const { error } = await supabase
        .from("gym_registration_codes")
        .update({ 
          code: newCode,
          active: true,
          expires_at: new Date(addDays(new Date(), 30)).toISOString() 
        })
        .eq("id", id)
        .eq("gym_id", gymId);

      if (error) throw error;
      
      setRegistrationCodes(prev => 
        prev.map(code => 
          code.id === id ? { 
            ...code, 
            code: newCode, 
            active: true, 
            expires_at: new Date(addDays(new Date(), 30)).toISOString() 
          } : code
        )
      );
      
      setCopyCode(newCode);
      
      toast({
        title: "Codice aggiornato",
        description: "Il codice di registrazione è stato rinnovato",
      });
    } catch (error) {
      console.error("Error refreshing registration code:", error);
      toast({
        title: "Errore",
        description: "Non è stato possibile rinnovare il codice",
        variant: "destructive",
      });
    } finally {
      setProcessingIds(prev => prev.filter(i => i !== id));
    }
  };

  return {
    loading,
    registrationCodes,
    gymId,
    isCreating,
    processingIds,
    refreshCode,
    toggleCodeStatus,
    deleteCode,
    handleCreateCode
  };
}
