
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateCreation } from "@/components/workout/TemplateCreation";
import { TemplateManager } from "@/components/workout/TemplateManager";

const WorkoutTemplates = () => {
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Workout Templates</h1>
        
        {!isCreatingTemplate && (
          <Button onClick={() => setIsCreatingTemplate(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        )}
      </div>
      
      {isCreatingTemplate ? (
        <TemplateCreation 
          onComplete={() => setIsCreatingTemplate(false)} 
        />
      ) : (
        <TemplateManager />
      )}
    </div>
  );
};

export default WorkoutTemplates;
