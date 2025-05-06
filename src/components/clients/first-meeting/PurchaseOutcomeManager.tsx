
import { useState } from "react";
import { CheckCircle2, ShoppingBag, FileText, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ClientData } from "../types/client-types";
import { usePurchaseOutcome } from "./usePurchaseOutcome";
import { useAuth } from "@/hooks/use-auth";

interface PurchaseOutcomeManagerProps {
  client: ClientData;
  onUpdate: () => void;
}

type PurchaseType = "package" | "custom_plan" | "none";

export const PurchaseOutcomeManager = ({ client, onUpdate }: PurchaseOutcomeManagerProps) => {
  const { userRole } = useAuth();
  const isTrainer = userRole === 'trainer';
  const isClientAssignedToCurrentUser = client.assigned_to === useAuth().user?.id;
  
  // Check if current user can edit the outcome
  const canEdit = isTrainer ? isClientAssignedToCurrentUser : true;
  
  // Pass onUpdate to the client object
  const clientWithCallback = { ...client, onRefresh: onUpdate };
  
  const {
    purchaseType,
    setPurchaseType,
    notes,
    setNotes,
    isUpdating,
    savePurchaseOutcome,
    gymSettings
  } = usePurchaseOutcome(clientWithCallback);

  const isFirstMeetingCompleted = client.first_meeting_completed;
  const hasOutcome = client.purchase_type !== null && client.purchase_type !== undefined;

  // Helper function to render the appropriate badge
  const renderStatusBadge = () => {
    if (!isFirstMeetingCompleted) {
      return (
        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
          In attesa del primo incontro
        </Badge>
      );
    }
    
    if (hasOutcome) {
      if (client.purchase_type === "package") {
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Pacchetto lezioni acquistato
          </Badge>
        );
      } else if (client.purchase_type === "custom_plan") {
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Scheda personalizzata
          </Badge>
        );
      } else {
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            Nessun acquisto
          </Badge>
        );
      }
    }
    
    return (
      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
        Esito non registrato
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            Esito Primo Incontro
          </CardTitle>
          {renderStatusBadge()}
        </div>
        <CardDescription>
          Registra l'esito del primo incontro con il cliente
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {!isFirstMeetingCompleted ? (
          <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-md">
            <AlertTriangle className="h-5 w-5" />
            <span>Per registrare l'esito, completa prima il primo incontro</span>
          </div>
        ) : hasOutcome ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span className="font-medium">Esito già registrato:</span>
              <span>
                {client.purchase_type === 'package' && 'Pacchetto lezioni'}
                {client.purchase_type === 'custom_plan' && 'Scheda personalizzata'}
                {client.purchase_type === 'none' && 'Nessun acquisto'}
              </span>
            </div>
            {client.internal_notes && (
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600 font-medium mb-1">Note:</p>
                <p className="text-sm">{client.internal_notes}</p>
              </div>
            )}
            {canEdit && (
              <Button onClick={() => setPurchaseType(null)} variant="outline" className="mt-3">
                Modifica esito
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <RadioGroup 
              value={purchaseType || ""} 
              onValueChange={(value) => setPurchaseType(value as PurchaseType || null)}
              className="space-y-3"
              disabled={!canEdit}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="package" id="package" />
                <Label htmlFor="package" className="flex items-center gap-2 cursor-pointer">
                  <ShoppingBag className="h-4 w-4 text-green-600" />
                  <span>Pacchetto lezioni</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom_plan" id="custom_plan" />
                <Label htmlFor="custom_plan" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>Scheda personalizzata</span>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none" className="flex items-center gap-2 cursor-pointer">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <span>Nessun acquisto</span>
                </Label>
              </div>
            </RadioGroup>
            
            {purchaseType === 'none' && gymSettings && (
              <div className="p-3 bg-yellow-50 rounded-md text-sm text-yellow-800">
                <p className="font-medium">Nota:</p>
                <p>Selezionando "Nessun acquisto", verrà pianificato automaticamente un follow-up tra {gymSettings.days_to_first_followup} giorni.</p>
                {gymSettings.require_default_template_assignment && (
                  <p className="mt-1">Sarà necessario assegnare una scheda di base al cliente.</p>
                )}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="notes">Note (opzionale)</Label>
              <Textarea 
                id="notes" 
                placeholder="Inserisci note aggiuntive sull'esito dell'incontro..." 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)}
                disabled={!canEdit}
              />
            </div>
            
            <Button 
              disabled={!purchaseType || isUpdating || !canEdit}
              onClick={savePurchaseOutcome}
              className="w-full sm:w-auto"
            >
              {isUpdating ? "Salvataggio..." : "Salva Esito"}
            </Button>
            
            {!canEdit && isTrainer && (
              <div className="p-3 bg-orange-50 text-orange-800 rounded-md text-sm">
                <p>Non puoi modificare i dati di questo cliente perché non ti è stato assegnato.</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
