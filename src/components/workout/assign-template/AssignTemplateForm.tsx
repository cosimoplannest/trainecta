
import { ClientSearch } from "./ClientSearch";
import { ClientSelect } from "./ClientSelect";
import { DeliveryMethodSelector } from "./DeliveryMethodSelector";
import { NotesInput } from "./NotesInput";
import { useAssignTemplate } from "./useAssignTemplate";
import { DialogFooterButtons } from "./DialogFooterButtons";
import { DialogFooter } from "@/components/ui/dialog";
import { useEffect } from "react";
import { AssignTemplateDialogProps } from "./types";

export function AssignTemplateForm({ template, onAssigned, onOpenChange, open }: AssignTemplateDialogProps) {
  const {
    filteredClients,
    clientsLoading,
    selectedClient,
    setSelectedClient,
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
        
        <DeliveryMethodSelector 
          deliveryChannel={deliveryChannel}
          setDeliveryChannel={setDeliveryChannel}
        />
        
        <NotesInput 
          notes={notes}
          setNotes={setNotes}
        />
      </div>
      
      <DialogFooter>
        <DialogFooterButtons 
          onCancel={() => onOpenChange(false)}
          onSubmit={handleAssignTemplate}
          loading={loading}
          isSubmitDisabled={!selectedClient}
        />
      </DialogFooter>
    </>
  );
}
