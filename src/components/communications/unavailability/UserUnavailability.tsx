
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Plus } from "lucide-react";
import { UnavailabilityForm } from "./UnavailabilityForm";
import { UnavailabilityList } from "./UnavailabilityList";

export function UserUnavailability() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleFormSuccess = () => {
    // Will trigger a re-fetch in the UnavailabilityList component
    setIsSheetOpen(false);
    // We'll force a page refresh to ensure the list is updated
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Gestione Indisponibilità</h2>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Segnala Indisponibilità</span>
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Segnala Indisponibilità</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <UnavailabilityForm 
                onSuccess={handleFormSuccess} 
                onClose={() => setIsSheetOpen(false)} 
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <UnavailabilityList />
    </div>
  );
}
