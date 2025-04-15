
import { useState } from "react";
import { Plus, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BroadcastMessageForm } from "./broadcast/BroadcastMessageForm";
import { BroadcastMessagesList } from "./broadcast/BroadcastMessagesList";

export function BroadcastMessages() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleFormSuccess = () => {
    // This will trigger a re-fetch in the BroadcastMessagesList component
    const messagesList = document.querySelector("[data-broadcast-messages-list]");
    if (messagesList) {
      const event = new CustomEvent("refreshMessages");
      messagesList.dispatchEvent(event);
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

      <div data-broadcast-messages-list>
        <BroadcastMessagesList />
      </div>
    </div>
  );
}
