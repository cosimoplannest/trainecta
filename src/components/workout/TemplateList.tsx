import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Edit, Trash2, File, Copy, EyeIcon, Users, Video } from "lucide-react";
import { WorkoutTemplate } from "@/types/workout";
import { Skeleton } from "@/components/ui/skeleton";
import { AssignTemplateDialog } from "./AssignTemplateDialog";

interface TemplateListProps {
  templates: WorkoutTemplate[];
  loading: boolean;
  onViewTemplate: (template: WorkoutTemplate) => void;
  onAssignTemplate: (template: WorkoutTemplate) => void;
  onDuplicateTemplate: (template: WorkoutTemplate) => void;
  onEditTemplate: (template: WorkoutTemplate) => void;
  onDeleteTemplate: (template: WorkoutTemplate) => void;
}

export const TemplateList = ({
  templates,
  loading,
  onViewTemplate,
  onAssignTemplate,
  onDuplicateTemplate,
  onEditTemplate,
  onDeleteTemplate,
}: TemplateListProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-4 border rounded-lg">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-4" />
            <div className="flex justify-between">
              <Skeleton className="h-8 w-1/5" />
              <Skeleton className="h-8 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return <p className="text-center py-4 text-muted-foreground">No templates found.</p>;
  }

  return (
    <div className="space-y-4">
      {templates.map((template) => (
        <div
          key={template.id}
          className="p-4 border rounded-lg hover:bg-accent/10 transition-colors"
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-semibold text-lg">{template.name}</h3>
              <p className="text-sm text-muted-foreground">
                {template.category} • {template.type}
                {template.user?.full_name && ` • Created by ${template.user.full_name}`}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onViewTemplate(template)}
                title="View template"
              >
                <EyeIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAssignTemplate(template)}
                title="Assign to client"
              >
                <Users className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDuplicateTemplate(template)}
                title="Duplicate template"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEditTemplate(template)}
                title="Edit template"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeleteTemplate(template)}
                title="Delete template"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {template.description && (
            <p className="text-sm mb-3">{template.description}</p>
          )}
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              {template.template_exercises ? (
                `${template.template_exercises.length} exercises`
              ) : (
                "No exercises"
              )}
              {template.assignment_count !== undefined && (
                ` • Assigned ${template.assignment_count} times`
              )}
            </div>
            
            {template.locked && (
              <span className="inline-flex items-center text-xs bg-green-100 text-green-800 rounded-full px-2 py-1">
                <Check className="h-3 w-3 mr-1" />
                Locked
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
