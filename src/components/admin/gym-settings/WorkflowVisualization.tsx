
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, CheckCircle, XCircle, ClipboardList, Calendar, Clock } from "lucide-react";
import { GymSettingsFormValues } from "./types";

interface WorkflowVisualizationProps {
  settings: GymSettingsFormValues;
}

export function WorkflowVisualization({ settings }: WorkflowVisualizationProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riepilogo Flussi Post-Primo Incontro</CardTitle>
        <CardDescription>
          Visualizzazione dei flussi automatici configurati per la gestione dei clienti
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* No Sale Workflow */}
          <div className="relative">
            <h3 className="flex items-center text-lg font-medium mb-4">
              <XCircle className="h-5 w-5 text-destructive mr-2" />
              Flusso "Non ha venduto nulla"
            </h3>
            
            <div className="border-l-2 pl-6 pb-2 relative">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-gray-400"></div>
              <p className="text-sm text-muted-foreground">Primo incontro completato</p>
            </div>
            
            <div className="border-l-2 pl-6 pb-2 relative">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-gray-400"></div>
              <p className="font-medium">
                {settings.require_default_template_assignment 
                  ? "Assegnazione obbligatoria di scheda precompilata" 
                  : "Assegnazione di scheda precompilata opzionale"}
              </p>
              <p className="text-sm text-muted-foreground">
                <ClipboardList className="h-4 w-4 inline-block mr-1" />
                Il trainer dovrà assegnare una scheda al cliente
              </p>
            </div>
            
            <div className="border-l-2 pl-6 pb-2 relative">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-gray-400"></div>
              <p className="font-medium">Follow-up obbligatorio</p>
              <p className="text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 inline-block mr-1" />
                {settings.days_to_first_followup} giorni dopo il primo incontro
              </p>
            </div>
            
            <div className="pl-6 relative">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-gray-400"></div>
              <p className="text-sm text-muted-foreground">Decisione sulla continuazione</p>
            </div>
          </div>
          
          {/* Package Sale Workflow */}
          <div className="relative">
            <h3 className="flex items-center text-lg font-medium mb-4">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Flusso "Venduto pacchetto lezioni"
            </h3>
            
            <div className="border-l-2 pl-6 pb-2 relative">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-gray-400"></div>
              <p className="text-sm text-muted-foreground">Primo incontro completato con vendita pacchetto</p>
            </div>
            
            <div className="border-l-2 pl-6 pb-2 relative">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-gray-400"></div>
              <p className="font-medium">Piano di allenamento</p>
              <p className="text-sm text-muted-foreground">
                <ClipboardList className="h-4 w-4 inline-block mr-1" />
                Sessioni programmate con il trainer
              </p>
            </div>
            
            <div className="border-l-2 pl-6 pb-2 relative">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-gray-400"></div>
              <p className="font-medium">Verifica attività cliente</p>
              <p className="text-sm text-muted-foreground">
                <Clock className="h-4 w-4 inline-block mr-1" />
                Dopo {settings.package_confirmation_days} giorni
              </p>
            </div>
            
            <div className="pl-6 relative">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-gray-400"></div>
              <p className="text-sm text-muted-foreground">Rinnovo o conclusione</p>
            </div>
          </div>
          
          {/* Custom Plan Sale Workflow */}
          <div className="relative">
            <h3 className="flex items-center text-lg font-medium mb-4">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              Flusso "Venduta scheda personalizzata"
            </h3>
            
            <div className="border-l-2 pl-6 pb-2 relative">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-gray-400"></div>
              <p className="text-sm text-muted-foreground">Primo incontro completato con vendita scheda</p>
            </div>
            
            <div className="border-l-2 pl-6 pb-2 relative">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-gray-400"></div>
              <p className="font-medium">Consegna scheda personalizzata</p>
              <p className="text-sm text-muted-foreground">
                <ClipboardList className="h-4 w-4 inline-block mr-1" />
                Il cliente segue la scheda in autonomia
              </p>
            </div>
            
            <div className="border-l-2 pl-6 pb-2 relative">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-gray-400"></div>
              <p className="font-medium">Verifica attività cliente</p>
              <p className="text-sm text-muted-foreground">
                <Clock className="h-4 w-4 inline-block mr-1" />
                Dopo {settings.custom_plan_confirmation_days} giorni
              </p>
            </div>
            
            <div className="pl-6 relative">
              <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-gray-400"></div>
              <p className="text-sm text-muted-foreground">Revisione scheda o conclusione</p>
            </div>
          </div>
          
          <div className="bg-muted p-4 rounded-lg mt-6">
            <h4 className="font-medium mb-2">Notifiche configurate</h4>
            <div className="flex gap-2">
              {settings.notification_channels.includes("app") && (
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">In-app</span>
              )}
              {settings.notification_channels.includes("email") && (
                <span className="bg-primary/10 text-primary text-xs px-2 py-1 rounded-full">Email</span>
              )}
              {settings.notification_channels.length === 0 && (
                <span className="text-muted-foreground text-sm">Nessun canale di notifica configurato</span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
