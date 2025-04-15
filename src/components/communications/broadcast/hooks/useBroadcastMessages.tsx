
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type BroadcastMessage = {
  id: string;
  title: string;
  content: string;
  sent_at: string;
  target_role: string | null;
  priority: string | null;
  sent_by: string;
  sent_by_user: {
    full_name: string | null;
  } | null;
};

export function useBroadcastMessages() {
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("broadcast_messages")
        .select(`
          id,
          title,
          content,
          sent_at,
          target_role,
          priority,
          sent_by,
          sent_by_user:sent_by(full_name)
        `)
        .order("sent_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error: any) {
      toast({
        title: "Errore",
        description: "Impossibile caricare i messaggi broadcast",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  return {
    messages,
    isLoading,
    fetchMessages
  };
}
