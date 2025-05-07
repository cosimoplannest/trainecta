
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { BroadcastMessageCard } from "./BroadcastMessageCard";
import { EmptyBroadcastMessages } from "./EmptyBroadcastMessages";
import { BroadcastMessagesLoading } from "./BroadcastMessagesLoading";
import { useBroadcastMessages } from "./hooks/useBroadcastMessages";
import { supabase } from "@/integrations/supabase/client";

export function BroadcastMessagesList() {
  const { user } = useAuth();
  const { messages, isLoading, fetchMessages } = useBroadcastMessages();
  const containerRef = useRef<HTMLDivElement>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Add more detailed debugging
  useEffect(() => {
    console.log("BroadcastMessagesList component mounted");
    console.log("User authenticated:", !!user);
    console.log("Messages count:", messages.length);
    console.log("Loading state:", isLoading);
    
    // Check if we're actually connected to Supabase
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from("broadcast_messages").select("count").limit(1);
        if (error) {
          console.error("Supabase connection error:", error);
          setDebugInfo(`DB Error: ${error.message}`);
        } else {
          console.log("Supabase connection successful, count query result:", data);
        }
      } catch (err) {
        console.error("Error checking Supabase connection:", err);
        setDebugInfo(`Connection Error: ${String(err)}`);
      }
    };
    
    checkSupabaseConnection();
    
    if (user) {
      fetchMessages();
    }
  }, [user]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleRefresh = () => {
      console.log("Refresh messages event triggered");
      fetchMessages();
    };

    container.addEventListener("refreshMessages", handleRefresh);
    return () => {
      container.removeEventListener("refreshMessages", handleRefresh);
    };
  }, [fetchMessages]);

  if (isLoading) {
    return <BroadcastMessagesLoading />;
  }

  if (messages.length === 0) {
    return (
      <>
        <EmptyBroadcastMessages />
        {debugInfo && (
          <div className="mt-4 p-2 bg-yellow-50 text-yellow-800 rounded text-xs">
            Debug: {debugInfo}
          </div>
        )}
      </>
    );
  }

  return (
    <div ref={containerRef} className="grid gap-4 md:grid-cols-2">
      {messages.map((message) => (
        <BroadcastMessageCard key={message.id} message={message} />
      ))}
      {debugInfo && (
        <div className="col-span-2 mt-4 p-2 bg-yellow-50 text-yellow-800 rounded text-xs">
          Debug: {debugInfo}
        </div>
      )}
    </div>
  );
}
