
import { FileText, Plus, AlertTriangle, CheckCircle } from "lucide-react";
import { format, isAfter, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { InsuranceFile } from "../types";

interface InsuranceCardProps {
  insurance: InsuranceFile | null;
  loading: boolean;
  isTrainer: boolean;
  onEdit: () => void;
}

export function InsuranceCard({ insurance, loading, isTrainer, onEdit }: InsuranceCardProps) {
  const isInsuranceExpired = insurance?.end_date 
    ? isAfter(new Date(), parseISO(insurance.end_date)) 
    : false;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Assicurazione RC
        </CardTitle>
        
        {isTrainer && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
          >
            {insurance ? (
              <>Aggiorna Assicurazione</>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Aggiungi Assicurazione
              </>
            )}
          </Button>
        )}
      </CardHeader>
      
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          </div>
        ) : insurance ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Stato</p>
                <div className="flex items-center gap-1 mt-1">
                  {isInsuranceExpired ? (
                    <>
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-500">Scaduta</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">Attiva</span>
                    </>
                  )}
                </div>
              </div>
              
              {insurance.policy_number && (
                <div>
                  <p className="text-sm font-medium">Numero Polizza</p>
                  <p className="text-sm">{insurance.policy_number}</p>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Data Inizio</p>
                <p className="text-sm">
                  {insurance.start_date ? format(new Date(insurance.start_date), 'dd/MM/yyyy') : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Data Fine</p>
                <p className="text-sm">
                  {insurance.end_date ? format(new Date(insurance.end_date), 'dd/MM/yyyy') : 'N/A'}
                </p>
              </div>
            </div>
            
            {insurance.notes && (
              <div>
                <p className="text-sm font-medium">Note</p>
                <p className="text-sm text-muted-foreground">{insurance.notes}</p>
              </div>
            )}
            
            {insurance.file_url && (
              <div>
                <a
                  href={insurance.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  Visualizza documento
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              {isTrainer 
                ? "Nessuna assicurazione registrata. Clicca su 'Aggiungi Assicurazione' per inserirne una."
                : "Nessuna assicurazione registrata. Il trainer deve inserire i dettagli dell'assicurazione."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
