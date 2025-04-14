
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContractDialog } from "./ContractDialog";
import { ContractList } from "./ContractList";
import { useContracts } from "./useContracts";

export function ContractManagement() {
  const {
    contracts,
    loading,
    dialogOpen,
    setDialogOpen,
    isEditing,
    formData,
    resetForm,
    openEditDialog,
    handleSubmit,
    handleDeleteContract
  } = useContracts();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestione Contratti e Abbonamenti</h2>
        <Button 
          className="flex items-center gap-2"
          onClick={() => setDialogOpen(true)}
        >
          <Plus size={16} />
          <span>Nuovo Contratto</span>
        </Button>
      </div>

      <ContractList 
        contracts={contracts}
        loading={loading}
        onEdit={openEditDialog}
        onDelete={handleDeleteContract}
      />

      <ContractDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        isEditing={isEditing}
        initialData={formData}
        resetForm={resetForm}
      />
    </div>
  );
}
