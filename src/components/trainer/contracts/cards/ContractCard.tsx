
import { useState } from "react";
import { FileText, Plus, AlertTriangle, CheckCircle, Calendar } from "lucide-react";
import { format, isAfter, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ContractFile } from "../types";

interface ContractCardProps {
  contract: ContractFile | null;
  loading: boolean;
  isAdmin: boolean;
  onEdit: () => void;
}

export function ContractCard({ contract, loading, isAdmin, onEdit }: ContractCardProps) {
  const isContractExpired = contract?.end_date 
    ? isAfter(new Date(), parseISO(contract.end_date)) 
    : false;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Contratto di Lavoro
        </CardTitle>
        
        {isAdmin && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
          >
            {contract ? (
              <>Modifica Contratto</>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Aggiungi Contratto
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
        ) : contract ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Tipo Contratto</p>
                <p className="text-sm">
                  {contract.contract_type === 'collaboration' ? 'Collaborazione' : 
                   contract.contract_type === 'vat_fixed_fee' ? 'Partita IVA (Compenso Fisso)' : 
                   'Partita IVA (Percentuale)'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Stato</p>
                <div className="flex items-center gap-1 mt-1">
                  {isContractExpired ? (
                    <>
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm text-red-500">Scaduto</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-green-500">Attivo</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Data Inizio</p>
                <p className="text-sm">
                  {contract.start_date ? format(new Date(contract.start_date), 'dd/MM/yyyy') : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Data Fine</p>
                <p className="text-sm">
                  {contract.end_date ? format(new Date(contract.end_date), 'dd/MM/yyyy') : 'Contratto a tempo indeterminato'}
                </p>
              </div>
            </div>
            
            {(contract.monthly_fee || contract.percentage) && (
              <div className="grid grid-cols-2 gap-4">
                {contract.monthly_fee !== null && (
                  <div>
                    <p className="text-sm font-medium">Compenso Mensile</p>
                    <p className="text-sm">€{contract.monthly_fee.toFixed(2)}</p>
                  </div>
                )}
                
                {contract.percentage !== null && (
                  <div>
                    <p className="text-sm font-medium">Percentuale</p>
                    <p className="text-sm">{contract.percentage}%</p>
                  </div>
                )}
              </div>
            )}
            
            {contract.notes && (
              <div>
                <p className="text-sm font-medium">Note</p>
                <p className="text-sm text-muted-foreground">{contract.notes}</p>
              </div>
            )}
            
            {contract.file_url && (
              <div>
                <a
                  href={contract.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  Visualizza contratto
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">
              {isAdmin 
                ? "Nessun contratto registrato. Clicca su 'Aggiungi Contratto' per inserirne uno."
                : "Nessun contratto registrato. Contatta l'amministratore per maggiori informazioni."}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
