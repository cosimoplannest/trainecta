
import { format } from "date-fns";
import { it } from "date-fns/locale";
import TemplateStatusBadges from "./TemplateStatusBadges";
import TemplateExerciseDetails from "./TemplateExerciseDetails";

interface TemplateExercise {
  id: string;
  sets: number;
  reps: string;
  exercise: {
    id: string;
    name: string;
    video_url?: string;
  }
}

interface AssignedTemplate {
  id: string;
  assigned_at: string;
  workout_template: { 
    id: string;
    name: string; 
    type: string; 
    category: string;
    template_exercises?: TemplateExercise[];
  } | null;
  assigned_by_user: { full_name: string } | null;
  delivery_status: string;
  delivery_channel: string;
  conversion_status: string | null;
}

interface TemplateItemProps {
  template: AssignedTemplate;
  isActive: boolean;
  onToggle: () => void;
}

const TemplateItem = ({ template, isActive, onToggle }: TemplateItemProps) => {
  return (
    <div key={template.id}>
      <div 
        className="flex items-start gap-4 pb-4 border-b cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">
                {template.workout_template?.name || "Scheda senza nome"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {template.workout_template?.type || "Tipo non specificato"}
                </span>
                <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
                  {template.workout_template?.category || "Categoria non specificata"}
                </span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {format(new Date(template.assigned_at), "d MMM yyyy", { locale: it })}
            </p>
          </div>
          
          <TemplateStatusBadges 
            conversionStatus={template.conversion_status}
            deliveryStatus={template.delivery_status}
            deliveryChannel={template.delivery_channel}
          />
          
          {template.assigned_by_user && (
            <p className="text-sm text-muted-foreground mt-2">
              Assegnato da: {template.assigned_by_user.full_name}
            </p>
          )}
        </div>
      </div>
      
      {isActive && template.workout_template?.template_exercises && (
        <TemplateExerciseDetails exercises={template.workout_template.template_exercises} />
      )}
    </div>
  );
};

export default TemplateItem;
