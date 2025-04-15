
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { LoaderCircle } from "lucide-react";
import { BroadcastMessageCard } from "./BroadcastMessageCard";
import { EmptyBroadcastMessages } from "./EmptyBroadcastMessages";

type BroadcastMessage = {
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

export function BroadcastMessagesList() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<BroadcastMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchMessages();
    }
  }, [user]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleRefresh = () => {
      fetchMessages();
    };

    container.addEventListener("refreshMessages", handleRefresh);
    return () => {
      container.removeEventListener("refreshMessages", handleRefresh);
    };
  }, []);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <LoaderCircle className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (messages.length === 0) {
    return <EmptyBroadcastMessages />;
  }

  return (
    <div ref={containerRef} className="grid gap-4 md:grid-cols-2">
      {messages.map((message) => (
        <BroadcastMessageCard key={message.id} message={message} />
      ))}
    </div>
  );
}
