
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Key, PlusCircle, Loader2 } from "lucide-react";
import { RegistrationCodesList } from "./RegistrationCodesList";
import { CreateCodeDialog } from "./CreateCodeDialog";
import { useRegistrationCodes } from "./use-registration-codes";

export function RegistrationCodes() {
  const { user } = useAuth();
  const [openCreate, setOpenCreate] = useState(false);
  const [copyCode, setCopyCode] = useState<string | null>(null);
  
  const { 
    loading, 
    registrationCodes, 
    gymId,
    processingIds,
    refreshCode,
    toggleCodeStatus,
    deleteCode,
    handleCreateCode
  } = useRegistrationCodes(user, setCopyCode);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            <CardTitle>Codici di Registrazione</CardTitle>
          </div>
          <Button onClick={() => setOpenCreate(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nuovo Codice
          </Button>
        </div>
        <CardDescription>
          Gestisci i codici di registrazione per il tuo staff
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : registrationCodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center">
            <Key className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">Nessun codice di registrazione disponibile</p>
            <p className="text-sm text-muted-foreground mt-1">
              Crea un nuovo codice per consentire al tuo staff di registrarsi
            </p>
          </div>
        ) : (
          <RegistrationCodesList 
            registrationCodes={registrationCodes}
            copyCode={copyCode}
            setCopyCode={setCopyCode}
            toggleCodeStatus={toggleCodeStatus}
            refreshCode={refreshCode}
            deleteCode={deleteCode}
            processingIds={processingIds}
          />
        )}

        <CreateCodeDialog 
          open={openCreate} 
          onOpenChange={setOpenCreate}
          handleCreateCode={handleCreateCode}
        />
      </CardContent>
    </Card>
  );
}
