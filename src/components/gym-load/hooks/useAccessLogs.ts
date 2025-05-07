
import { useState } from "react";
import { GymAccessLog } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { format, parse } from "date-fns";

export const useAccessLogs = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const getAccessLogsByDate = async (date: string) => {
    if (!user) return [];
    
    setLoading(true);
    try {
      // Get gym_id from user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('gym_id')
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      
      const { data, error } = await supabase
        .from('gym_access_logs')
        .select('*')
        .eq('date', date)
        .eq('gym_id', userData.gym_id)
        .order('hour')
        .order('minute');
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching access logs:', error);
      toast({
        title: "Errore",
        description: "Impossibile recuperare i dati di accesso",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getAccessLogsByDateRange = async (from: string, to: string) => {
    if (!user) return [];
    
    setLoading(true);
    try {
      // Get gym_id from user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('gym_id')
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      
      const { data, error } = await supabase
        .from('gym_access_logs')
        .select('*')
        .gte('date', from)
        .lte('date', to)
        .eq('gym_id', userData.gym_id)
        .order('date')
        .order('hour')
        .order('minute');
      
      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching access logs:', error);
      toast({
        title: "Errore",
        description: "Impossibile recuperare i dati di accesso",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const saveAccessLog = async (log: Omit<GymAccessLog, 'id' | 'created_at' | 'updated_at' | 'gym_id'>) => {
    if (!user) return null;
    
    setLoading(true);
    try {
      // Get gym_id from user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('gym_id')
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      
      // Check if access log already exists
      const { data: existingData, error: checkError } = await supabase
        .from('gym_access_logs')
        .select('id')
        .eq('date', log.date)
        .eq('hour', log.hour)
        .eq('minute', log.minute)
        .eq('gym_id', userData.gym_id)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      let result;
      
      if (existingData) {
        // Update existing record
        const { data, error } = await supabase
          .from('gym_access_logs')
          .update({
            entries: log.entries
          })
          .eq('id', existingData.id)
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('gym_access_logs')
          .insert({
            ...log,
            gym_id: userData.gym_id
          })
          .select()
          .single();
        
        if (error) throw error;
        result = data;
      }
      
      toast({
        title: "Dati salvati",
        description: "I dati di accesso sono stati salvati con successo",
      });
      
      return result;
    } catch (error: any) {
      console.error('Error saving access log:', error);
      toast({
        title: "Errore",
        description: "Impossibile salvare i dati di accesso",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Import access logs from CSV format (time,entries)
  const importAccessLogs = async (date: string, csvData: string) => {
    if (!user) return false;
    
    setLoading(true);
    try {
      // Get gym_id from user
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('gym_id')
        .eq('id', user.id)
        .single();
      
      if (userError) throw userError;
      
      // Parse CSV data
      const lines = csvData.trim().split('\n');
      const logs: Array<Omit<GymAccessLog, 'id' | 'created_at' | 'updated_at'>> = [];
      
      for (const line of lines) {
        const [timeStr, entriesStr] = line.split(',');
        if (!timeStr || !entriesStr) continue;
        
        try {
          const time = parse(timeStr.trim(), 'HH:mm', new Date());
          const entries = parseInt(entriesStr.trim(), 10);
          
          if (isNaN(entries)) continue;
          
          logs.push({
            date,
            hour: time.getHours(),
            minute: time.getMinutes(),
            entries,
            gym_id: userData.gym_id
          });
        } catch (e) {
          console.error('Error parsing time:', timeStr);
        }
      }
      
      if (logs.length === 0) {
        toast({
          title: "Errore",
          description: "Nessun dato valido trovato nel CSV",
          variant: "destructive",
        });
        return false;
      }
      
      // Insert all logs
      const { error } = await supabase
        .from('gym_access_logs')
        .upsert(logs, {
          onConflict: 'gym_id,date,hour,minute',
          ignoreDuplicates: false
        });
      
      if (error) throw error;
      
      toast({
        title: "Importazione completata",
        description: `Importati ${logs.length} record di accesso`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error importing access logs:', error);
      toast({
        title: "Errore",
        description: "Impossibile importare i dati di accesso",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    getAccessLogsByDate,
    getAccessLogsByDateRange,
    saveAccessLog,
    importAccessLogs
  };
};
