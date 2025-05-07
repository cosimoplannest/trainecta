
import { useState, useEffect } from "react";
import { Room } from "../types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export const useRooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchRooms = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setRooms(data || []);
    } catch (error: any) {
      console.error('Error fetching rooms:', error);
      toast({
        title: "Errore",
        description: "Impossibile recuperare le sale",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (room: Omit<Room, 'id' | 'created_at' | 'updated_at' | 'gym_id'>) => {
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
        .from('rooms')
        .insert({ ...room, gym_id: userData.gym_id })
        .select()
        .single();
      
      if (error) throw error;
      
      setRooms(prev => [...prev, data]);
      
      toast({
        title: "Sala aggiunta",
        description: `La sala ${room.name} è stata aggiunta con successo`,
      });
      
      return data;
    } catch (error: any) {
      console.error('Error creating room:', error);
      toast({
        title: "Errore",
        description: "Impossibile creare la sala",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateRoom = async (id: string, room: Partial<Room>) => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('rooms')
        .update(room)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      setRooms(prev => prev.map(r => r.id === id ? data : r));
      
      toast({
        title: "Sala aggiornata",
        description: `La sala è stata aggiornata con successo`,
      });
      
      return data;
    } catch (error: any) {
      console.error('Error updating room:', error);
      toast({
        title: "Errore",
        description: "Impossibile aggiornare la sala",
        variant: "destructive",
      });
      return null;
    }
  };

  const deleteRoom = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setRooms(prev => prev.filter(r => r.id !== id));
      
      toast({
        title: "Sala eliminata",
        description: `La sala è stata eliminata con successo`,
      });
      
      return true;
    } catch (error: any) {
      console.error('Error deleting room:', error);
      toast({
        title: "Errore",
        description: "Impossibile eliminare la sala. Assicurati che non ci siano corsi associati.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  return {
    rooms,
    loading,
    fetchRooms,
    createRoom,
    updateRoom,
    deleteRoom
  };
};
