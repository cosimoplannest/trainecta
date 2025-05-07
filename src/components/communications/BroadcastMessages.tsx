
import { useState, useRef, useEffect } from "react";
import { Plus, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BroadcastMessageForm } from "./broadcast/BroadcastMessageForm";
import { BroadcastMessagesList } from "./broadcast/BroadcastMessagesList";
import { useAuth } from "@/hooks/use-auth";

export function BroadcastMessages() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  // Add debug logging
  useEffect(() => {
    console.log("BroadcastMessages component mounted, user:", user?.id);
  }, [user]);

  const handleFormSuccess = () => {
    console.log("Message form submitted successfully, triggering refresh");
    setIsSheetOpen(false);
    
    // Fix the event dispatch issue by using the ref approach
    if (listRef.current) {
      console.log("Dispatching refreshMessages event to list element");
      const event = new CustomEvent("refreshMessages");
      listRef.current.dispatchEvent(event);
    } else {
      console.warn("List element ref not available, can't dispatch event");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Messaggi Broadcast</h2>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Nuovo Messaggio</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Nuovo Messaggio Broadcast</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <BroadcastMessageForm 
                onSuccess={handleFormSuccess} 
                onClose={() => setIsSheetOpen(false)} 
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div ref={listRef} data-broadcast-messages-list>
        <BroadcastMessagesList />
      </div>
    </div>
  );
}
