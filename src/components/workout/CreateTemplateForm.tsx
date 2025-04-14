
import React from "react";
import { WorkoutType } from "@/types/workout";
import { TemplateNameField } from "./template-form/TemplateNameField";
import { TemplateCategoryField } from "./template-form/TemplateCategoryField";
import { TemplateDescriptionField } from "./template-form/TemplateDescriptionField";
import { WorkoutTypeField } from "./template-form/WorkoutTypeField";
import { FormActions } from "./template-form/FormActions";

interface CreateTemplateFormProps {
  newTemplate: {
    name: string;
    category: string;
    description: string;
    type: WorkoutType;
  };
  setNewTemplate: (template: any) => void;
  createTemplate: () => void;
  cancelCreate: () => void;
  loading?: boolean;
}

export const CreateTemplateForm = ({
  newTemplate,
  setNewTemplate,
  createTemplate,
  cancelCreate,
  loading = false
}: CreateTemplateFormProps) => {
  const handleNameChange = (name: string) => {
    setNewTemplate({ ...newTemplate, name });
  };

  const handleCategoryChange = (category: string) => {
    setNewTemplate({ ...newTemplate, category });
  };

  const handleDescriptionChange = (description: string) => {
    setNewTemplate({ ...newTemplate, description });
  };

  const handleTypeChange = (type: WorkoutType) => {
    setNewTemplate({ ...newTemplate, type });
  };

  return (
    <div className="space-y-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
      <h2 className="text-lg font-semibold">Create New Template</h2>
      
      <div className="grid gap-4">
        <TemplateNameField 
          value={newTemplate.name} 
          onChange={handleNameChange} 
        />
        
        <TemplateCategoryField 
          value={newTemplate.category} 
          onChange={handleCategoryChange} 
        />
        
        <TemplateDescriptionField 
          value={newTemplate.description || ""} 
          onChange={handleDescriptionChange} 
        />
        
        <WorkoutTypeField 
          value={newTemplate.type} 
          onChange={handleTypeChange} 
        />
      </div>
      
      <FormActions 
        onCancel={cancelCreate}
        onSubmit={createTemplate}
        loading={loading}
        submitLabel="Create Template"
      />
    </div>
  );
};
