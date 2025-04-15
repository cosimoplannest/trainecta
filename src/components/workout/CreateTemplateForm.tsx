
import React from 'react';
import { TemplateNameField } from '@/components/workout/template-form/TemplateNameField';
import { TemplateCategoryField } from '@/components/workout/template-form/TemplateCategoryField';
import { TemplateDescriptionField } from '@/components/workout/template-form/TemplateDescriptionField';
import { WorkoutTypeField } from '@/components/workout/template-form/WorkoutTypeField';
import { FormActions } from '@/components/workout/template-form/FormActions';
import { WorkoutTemplate, WorkoutType } from '@/types/workout';

interface CreateTemplateFormProps {
  newTemplate: {
    name: string;
    category: string;
    description?: string;
    type?: WorkoutType;
  };
  setNewTemplate: (template: Partial<WorkoutTemplate>) => void;
  createTemplate: () => void;
  cancelCreate: () => void;
  loading?: boolean;
}

export const CreateTemplateForm: React.FC<CreateTemplateFormProps> = ({
  newTemplate,
  setNewTemplate,
  createTemplate,
  cancelCreate,
  loading = false
}) => {
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
      <h2 className="text-lg font-semibold">Crea nuovo template</h2>
      
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
          value={newTemplate.type || "full_body"} 
          onChange={handleTypeChange} 
        />
        
        <FormActions 
          onCancel={cancelCreate} 
          onSubmit={createTemplate} 
          loading={loading}
          submitLabel="Crea Template"
          cancelLabel="Annulla" 
        />
      </div>
    </div>
  );
};
