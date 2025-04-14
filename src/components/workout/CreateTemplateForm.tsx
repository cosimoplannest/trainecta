
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { WorkoutType } from "@/types/workout";

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
  const workoutTypes: { value: WorkoutType; label: string }[] = [
    { value: "full_body", label: "Full Body" },
    { value: "upper_body", label: "Upper Body" },
    { value: "lower_body", label: "Lower Body" },
    { value: "push", label: "Push" },
    { value: "pull", label: "Pull" },
    { value: "legs", label: "Legs" },
    { value: "core", label: "Core" },
    { value: "cardio", label: "Cardio" },
    { value: "circuit", label: "Circuit" },
    { value: "arms", label: "Arms" },
    { value: "shoulders", label: "Shoulders" },
    { value: "back", label: "Back" },
    { value: "chest", label: "Chest" }
  ];

  return (
    <div className="space-y-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
      <h2 className="text-lg font-semibold">Create New Template</h2>
      
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="template-name">Template Name</Label>
          <Input
            id="template-name"
            value={newTemplate.name}
            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
            placeholder="e.g. Beginner Full Body"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="template-category">Category</Label>
          <Input
            id="template-category"
            value={newTemplate.category}
            onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
            placeholder="e.g. Beginner, Advanced, etc."
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="template-description">Description</Label>
          <Textarea
            id="template-description"
            value={newTemplate.description || ""}
            onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
            placeholder="Describe this workout template..."
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="template-type">Workout Type</Label>
          <Select
            value={newTemplate.type}
            onValueChange={(value) => setNewTemplate({ ...newTemplate, type: value as WorkoutType })}
          >
            <SelectTrigger id="template-type">
              <SelectValue placeholder="Select workout type" />
            </SelectTrigger>
            <SelectContent>
              {workoutTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={cancelCreate}>
          Cancel
        </Button>
        <Button onClick={createTemplate} disabled={loading}>
          {loading ? "Creating..." : "Create Template"}
        </Button>
      </div>
    </div>
  );
};
