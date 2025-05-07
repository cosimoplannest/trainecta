
import { useState, useEffect } from "react";
import { GymClass } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const useClasses = () => {
  const [classes, setClasses] = useState<GymClass[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchClasses = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          room:rooms(*),
          instructor:instructor_id(full_name)
        `)
        .order('day_of_week')
        .order('start_time');
      
      if (error) throw error;
      setClasses(data || []);
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      toast({
        title: "Errore",
        description: "Impossibile recuperare i corsi",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createClass = async (gymClass: Omit<GymClass, 'id' | 'created_at' | 'updated_at' | 'gym_id' | 'room' | 'instructor'>) => {
    if (!user) return;
    
    try {
      // Get gym_id from user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('gym_id')
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      
      const { data, error } = await supabase
        .from('classes')
        .insert({ ...gymClass, gym_id: userData.gym_id })
        .select()
        .single();
      
      if (error) throw error;
      
      await fetchClasses(); // Refetch to get relationships
      
      toast({
        title: "Corso aggiunto",
        description: `Il corso ${gymClass.name} è stato aggiunto con successo`,
      });
      
      return data;
    } catch (error: any) {
      console.error('Error creating class:', error);
      toast({
        title: "Errore",
        description: "Impossibile creare il corso",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateClass = async (id: string, gymClass: Partial<GymClass>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('classes')
        .update(gymClass)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      await fetchClasses(); // Refetch to get relationships
      
      toast({
        title: "Corso aggiornato",
        description: `Il corso è stato aggiornato con successo`,
      });
      
      return data;
    } catch (error: any) {
      console.error('Error updating class:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il corso",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteClass = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setClasses(prev => prev.filter(c => c.id !== id));
      
      toast({
        title: "Corso eliminato",
        description: `Il corso è stato eliminato con successo`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting class:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare il corso",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchClasses();
    }
  }, [user]);

  return {
    classes,
    loading,
    fetchClasses,
    createClass,
    updateClass,
    deleteClass
  };
};
