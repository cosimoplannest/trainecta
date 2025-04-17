
import { useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { ContractTypeField } from "./components/ContractTypeField";
import { ContractDateFields } from "./components/ContractDateFields";
import { CompensationFields } from "./components/CompensationFields";
import { useContractForm } from "./hooks/useContractForm";
import type { TrainerContractDialogProps } from "./types";

export function TrainerContractDialog({
  open,
  onOpenChange,
  trainerId,
  contract,
  onSuccess,
  isAdmin
}: TrainerContractDialogProps) {
  const { user } = useAuth();
  const { form, isSubmitting, handleFileChange, onSubmit, file } = useContractForm({
    trainerId,
    gymId: user?.user_metadata.gym_id,
    contract,
    onSuccess,
    onClose: () => onOpenChange(false)
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>
            {contract ? "Modifica Contratto" : "Aggiungi Contratto"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ContractTypeField form={form} disabled={!isAdmin || isSubmitting} />
            
            <ContractDateFields form={form} disabled={!isAdmin || isSubmitting} />
            
            <CompensationFields form={form} disabled={!isAdmin || isSubmitting} />

            <div className="space-y-2">
              <label className="text-sm font-medium">Note (opzionale)</label>
              <Textarea
                {...form.register("notes")}
                placeholder="Note sul contratto..."
                className="resize-none"
                disabled={!isAdmin || isSubmitting}
              />
            </div>

            <div className="grid gap-2">
              <label className="text-sm font-medium">Contratto (PDF)</label>
              <div className="flex items-center gap-2">
                {contract?.file_url && (
                  <a
                    href={contract.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <FileText className="h-4 w-4" />
                    Visualizza contratto attuale
                  </a>
                )}
              </div>
              <Input
                type="file"
                accept=".pdf"
                disabled={!isAdmin || isSubmitting}
                onChange={handleFileChange}
              />
              {file && (
                <p className="text-sm text-muted-foreground">
                  File selezionato: {file.name}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annulla
              </Button>
              <Button 
                type="submit"
                disabled={!isAdmin || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvataggio...
                  </>
                ) : (
                  "Salva Contratto"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
