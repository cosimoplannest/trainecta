
import { ClientSearch } from "./ClientSearch";
import { ClientSelect } from "./ClientSelect";
import { DeliveryMethodSelector } from "./DeliveryMethodSelector";
import { NotesInput } from "./NotesInput";
import { useAssignTemplate } from "./useAssignTemplate";
import { DialogFooterButtons } from "./DialogFooterButtons";
import { DialogFooter } from "@/components/ui/dialog";
import { useEffect } from "react";
import { AssignTemplateDialogProps } from "./types";
import { WhatsAppShareButton } from "./WhatsAppShareButton";
import { Badge } from "@/components/ui/badge";

export function AssignTemplateForm({ template, onAssigned, onOpenChange, open }: AssignTemplateDialogProps) {
  const {
    filteredClients,
    clientsLoading,
    selectedClient,
    setSelectedClient,
    selectedClientData,
    deliveryChannel,
    setDeliveryChannel,
    notes,
    setNotes,
    searchQuery,
    setSearchQuery,
    loading,
    fetchClients,
    handleAssignTemplate,
    clients
  } = useAssignTemplate(template, onAssigned, onOpenChange);

  useEffect(() => {
    fetchClients(open);
  }, [open]);

  if (!template) return null;

  const handleWhatsAppSuccess = () => {
    // Close the dialog after WhatsApp is opened
    onOpenChange(false);
  };

  const showWhatsAppButton = deliveryChannel === "whatsapp" && selectedClientData && template;

  return (
    <>
      <div className="grid gap-4 py-4">
        <ClientSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          resultCount={filteredClients.length}
          totalCount={clients.length}
        />

        <ClientSelect 
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          filteredClients={filteredClients}
          clientsLoading={clientsLoading}
        />
        
        {selectedClientData && !selectedClientData.phone && deliveryChannel === "whatsapp" && (
          <Badge variant="outline" className="w-fit bg-amber-50 text-amber-800 border-amber-200">
            Attenzione: il cliente non ha un numero di telefono registrato
          </Badge>
        )}
        
        <DeliveryMethodSelector 
          deliveryChannel={deliveryChannel}
          setDeliveryChannel={setDeliveryChannel}
        />
        
        <NotesInput 
          notes={notes}
          setNotes={setNotes}
        />
      </div>
      
      <DialogFooter className="flex flex-col gap-2 sm:flex-row">
        {showWhatsAppButton && (
          <WhatsAppShareButton 
            template={template}
            client={selectedClientData}
            onSuccess={handleWhatsAppSuccess}
          />
        )}
        
        <div className="flex-1 flex justify-end gap-2">
          <DialogFooterButtons 
            onCancel={() => onOpenChange(false)}
            onSubmit={handleAssignTemplate}
            loading={loading}
            isSubmitDisabled={!selectedClient}
          />
        </div>
      </DialogFooter>
    </>
  );
}
