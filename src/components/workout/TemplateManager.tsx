
import React, { useState } from 'react';
import { WorkoutTemplate } from '@/types/workout';
import { useWorkoutTemplates } from '@/hooks/use-workout-templates';
import { TemplateSearch } from '@/components/workout/TemplateSearch';
import { TemplateList } from '@/components/workout/TemplateList';
import { ViewTemplateDialog } from '@/components/workout/ViewTemplateDialog';
import { AssignTemplateDialog } from '@/components/workout/AssignTemplateDialog';
import { toast } from 'sonner';

export const TemplateManager: React.FC = () => {
  const { templates, loading, setTemplates, duplicateTemplate, deleteTemplate } = useWorkoutTemplates();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentTemplate, setCurrentTemplate] = useState<WorkoutTemplate | null>(null);
  const [isViewingTemplate, setIsViewingTemplate] = useState(false);
  const [isAssigningTemplate, setIsAssigningTemplate] = useState(false);

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewTemplate = (template: WorkoutTemplate) => {
    setCurrentTemplate(template);
    setIsViewingTemplate(true);
  };
  
  const handleAssignTemplate = (template: WorkoutTemplate) => {
    setCurrentTemplate(template);
    setIsAssigningTemplate(true);
  };
  
  const handleDuplicateTemplate = async (template: WorkoutTemplate) => {
    const duplicated = await duplicateTemplate(template);
    if (duplicated) {
      setTemplates([duplicated, ...templates]);
    }
  };
  
  const handleEditTemplate = (template: WorkoutTemplate) => {
    toast.info("Functionality for editing in future versions");
  };
  
  const handleDeleteTemplate = async (template: WorkoutTemplate) => {
    if (confirm(`Are you sure you want to delete the template "${template.name}"?`)) {
      const deleted = await deleteTemplate(template.id);
      if (deleted) {
        setTemplates(templates.filter(t => t.id !== template.id));
      }
    }
  };
  
  const handleTemplateAssigned = async () => {
    if (!currentTemplate) return;
    
    const updatedTemplates = templates.map(t => 
      t.id === currentTemplate.id 
        ? { ...t, assignment_count: (t.assignment_count || 0) + 1 } 
        : t
    );
    setTemplates(updatedTemplates);
  };

  return (
    <>
      <div className="mb-6">
        <TemplateSearch 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
      
      <TemplateList
        templates={filteredTemplates}
        loading={loading}
        onViewTemplate={handleViewTemplate}
        onAssignTemplate={handleAssignTemplate}
        onDuplicateTemplate={handleDuplicateTemplate}
        onEditTemplate={handleEditTemplate}
        onDeleteTemplate={handleDeleteTemplate}
      />
      
      <ViewTemplateDialog
        open={isViewingTemplate}
        onOpenChange={setIsViewingTemplate}
        template={currentTemplate}
      />
      
      <AssignTemplateDialog
        open={isAssigningTemplate}
        onOpenChange={setIsAssigningTemplate}
        template={currentTemplate}
        onAssigned={handleTemplateAssigned}
      />
    </>
  );
};
