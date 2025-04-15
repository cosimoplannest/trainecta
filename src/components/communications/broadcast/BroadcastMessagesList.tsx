
import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { BroadcastMessageCard } from "./BroadcastMessageCard";
import { EmptyBroadcastMessages } from "./EmptyBroadcastMessages";
import { BroadcastMessagesLoading } from "./BroadcastMessagesLoading";
import { useBroadcastMessages } from "./hooks/useBroadcastMessages";

export function BroadcastMessagesList() {
  const { user } = useAuth();
  const { messages, isLoading, fetchMessages } = useBroadcastMessages();
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
  }, [fetchMessages]);

  if (isLoading) {
    return <BroadcastMessagesLoading />;
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
