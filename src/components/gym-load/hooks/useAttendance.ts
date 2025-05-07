
import { useState } from "react";
import { ClassAttendance } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const useAttendance = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const getAttendanceByDate = async (date: string) => {
    if (!user) return [];
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('class_attendance')
        .select(`
          *,
          class:class_id(
            id,
            name,
            start_time,
            end_time,
            max_capacity,
            room_id
          )
        `)
        .eq('date', date);
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching attendance:', error);
      toast({
        title: "Errore",
        description: "Impossibile recuperare i dati di presenza",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const saveAttendance = async (attendance: Omit<ClassAttendance, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      // Check if attendance record already exists
      const { data: existingData, error: checkError } = await supabase
        .from('class_attendance')
        .select('id')
        .eq('class_id', attendance.class_id)
        .eq('date', attendance.date)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      let result;
      
      if (existingData) {
        // Update existing record
        const { data, error } = await supabase
          .from('class_attendance')
          .update({
            participants: attendance.participants,
            created_by: user.id
          })
          .eq('id', existingData.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('class_attendance')
          .insert({
            ...attendance,
            created_by: user.id
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      toast({
        title: "Presenze salvate",
        description: "I dati di presenza sono stati salvati con successo",
      });
      
      return result;
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare i dati di presenza",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getAttendanceByDate,
    saveAttendance
  };
};
