
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { UserWithRoleType } from "./types";
import { useAuth } from "@/hooks/use-auth";

export const useUsers = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState<UserWithRoleType[]>([]);
  const [operators, setOperators] = useState<UserWithRoleType[]>([]);
  const [trainers, setTrainers] = useState<UserWithRoleType[]>([]);
  const [assistants, setAssistants] = useState<UserWithRoleType[]>([]);
  const [instructors, setInstructors] = useState<UserWithRoleType[]>([]);
  const [loading, setLoading] = useState(true);
  const [gymId, setGymId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserGymId = async () => {
      if (!user) return null;

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

    const fetchUsers = async () => {
      setLoading(true);
      const userGymId = await fetchUserGymId();
      
      if (!userGymId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("gym_id", userGymId);

        if (error) throw error;

        if (data) {
          setAdmins(data.filter(u => u.role === 'admin'));
          setOperators(data.filter(u => u.role === 'operator'));
          setTrainers(data.filter(u => u.role === 'trainer'));
          setAssistants(data.filter(u => u.role === 'assistant'));
          setInstructors(data.filter(u => u.role === 'instructor'));
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Errore",
          description: "Non è stato possibile recuperare l'elenco degli utenti",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  return {
    admins,
    operators,
    trainers,
    assistants,
    instructors,
    loading,
    gymId
  };
};
