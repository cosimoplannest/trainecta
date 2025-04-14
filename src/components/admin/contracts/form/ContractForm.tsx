
import React from "react";
import { ContractFormData } from "../types";
import { ContractFormField } from "./ContractFormField";
import { ContractTypeSelect } from "./ContractTypeSelect";
import { ContractDurationSelect } from "./ContractDurationSelect";
import { ContractStatusSelect } from "./ContractStatusSelect";

interface ContractFormProps {
  formData: ContractFormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSelectChange: (field: string, value: string) => void;
}

export function ContractForm({
  formData,
  handleInputChange,
  handleSelectChange
}: ContractFormProps) {
  return (
    <div className="grid gap-4 py-4">
      <ContractFormField
        id="name"
        label="Nome"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="es. Premium Mensile"
      />
      
      <ContractFormField
        id="description"
        label="Descrizione"
        value={formData.description}
        onChange={handleInputChange}
        placeholder="Descrizione del contratto..."
      />
      
      <div className="grid grid-cols-2 gap-4">
        <ContractTypeSelect
          value={formData.type}
          onValueChange={(value) => handleSelectChange("type", value)}
        />
        
        <ContractFormField
          id="price"
          label="Prezzo (€)"
          type="number"
          min="0"
          step="0.01"
          value={formData.price}
          onChange={handleInputChange}
          placeholder="0.00"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <ContractDurationSelect
          value={formData.duration}
          onValueChange={(value) => handleSelectChange("duration", value)}
        />
        
        <ContractStatusSelect
          value={formData.status}
          onValueChange={(value) => handleSelectChange("status", value)}
        />
      </div>
    </div>
  );
}
