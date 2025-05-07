
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

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
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchMessages = async () => {
    if (!user?.id) {
      console.warn("fetchMessages called but no user ID available");
      setError("Authentication required");
      setIsLoading(false);
      return;
    }
    
    console.log("Fetching broadcast messages for user:", user.id);
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

      if (error) {
        console.error("Error fetching broadcast messages:", error);
        throw error;
      }
      
      console.log("Broadcast messages fetched:", data?.length || 0);
      
      // Insert a test message if none found (development only)
      if ((!data || data.length === 0) && process.env.NODE_ENV !== 'production') {
        console.log("No messages found, creating a test message for debugging");
        const testMessage: BroadcastMessage = {
          id: 'test-message',
          title: 'Test Broadcast Message',
          content: 'This is a test message for debugging. If you see this, the component is rendering correctly but no real messages were found in the database.',
          sent_at: new Date().toISOString(),
          target_role: null,
          priority: 'normal',
          sent_by: user.id,
          sent_by_user: {
            full_name: 'Debugging User'
          }
        };
        setMessages([testMessage]);
      } else {
        setMessages(data || []);
      }
      setError(null);
    } catch (error: any) {
      console.error("Error in useBroadcastMessages:", error);
      setError(error.message);
      toast({
        title: "Errore",
        description: "Impossibile caricare i messaggi broadcast",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchMessages();
    }
  }, [user?.id]);

  return {
    messages,
    isLoading,
    error,
    fetchMessages
  };
}
