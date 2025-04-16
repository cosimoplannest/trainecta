
import { useState } from "react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { Video } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

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

interface ClientTemplatesProps {
  templates: AssignedTemplate[];
}

const ClientTemplates = ({ templates }: ClientTemplatesProps) => {
  const [activeTemplate, setActiveTemplate] = useState<string | null>(null);

  const toggleTemplateDetails = (templateId: string) => {
    if (activeTemplate === templateId) {
      setActiveTemplate(null);
    } else {
      setActiveTemplate(templateId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schede Assegnate</CardTitle>
        <CardDescription>Schede di allenamento assegnate al cliente</CardDescription>
      </CardHeader>
      <CardContent>
        {templates.length > 0 ? (
          <div className="space-y-4">
            {templates.map((template) => (
              <div key={template.id}>
                <div 
                  className="flex items-start gap-4 pb-4 border-b cursor-pointer"
                  onClick={() => toggleTemplateDetails(template.id)}
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
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        template.conversion_status === "converted" 
                          ? "bg-green-100 text-green-800" 
                          : template.conversion_status === "not_converted"
                          ? "bg-red-100 text-red-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {template.conversion_status === "converted" 
                          ? "Convertito" 
                          : template.conversion_status === "not_converted"
                          ? "Non Convertito"
                          : "In attesa"}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        template.delivery_status === "delivered" 
                          ? "bg-blue-100 text-blue-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {template.delivery_status === "delivered" ? "Consegnato" : "Non consegnato"}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-800">
                        {template.delivery_channel === "whatsapp" ? "WhatsApp" : "Email"}
                      </span>
                    </div>
                    {template.assigned_by_user && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Assegnato da: {template.assigned_by_user.full_name}
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Template Details Section */}
                {activeTemplate === template.id && template.workout_template?.template_exercises && (
                  <div className="mt-4 mb-6 pl-4 border-l-2 border-muted">
                    <h4 className="text-sm font-medium mb-2">Dettaglio Esercizi</h4>
                    <div className="border rounded-md overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-muted">
                          <tr>
                            <th className="px-4 py-2 text-left">Esercizio</th>
                            <th className="px-4 py-2 text-center">Serie</th>
                            <th className="px-4 py-2 text-center">Ripetizioni</th>
                            <th className="px-4 py-2 text-right">Video</th>
                          </tr>
                        </thead>
                        <tbody>
                          {template.workout_template.template_exercises.map((exercise) => (
                            <tr key={exercise.id} className="border-t border-muted">
                              <td className="px-4 py-2">{exercise.exercise.name}</td>
                              <td className="px-4 py-2 text-center">{exercise.sets}</td>
                              <td className="px-4 py-2 text-center">{exercise.reps}</td>
                              <td className="px-4 py-2 text-right">
                                {exercise.exercise.video_url ? (
                                  <a 
                                    href={exercise.exercise.video_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-blue-500 inline-flex items-center gap-1"
                                  >
                                    <Video className="h-4 w-4" />
                                  </a>
                                ) : (
                                  <span className="text-muted-foreground">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Nessuna scheda assegnata a questo cliente
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClientTemplates;
