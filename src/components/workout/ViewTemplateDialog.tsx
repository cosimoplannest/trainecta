
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Users, Video } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { WorkoutTemplate, TemplateExercise, TemplateExerciseWithNestedExercise } from "@/types/workout";

interface ViewTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: WorkoutTemplate | null;
}

export function ViewTemplateDialog({ open, onOpenChange, template }: ViewTemplateDialogProps) {
  if (!template) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{template.name}</DialogTitle>
          <DialogDescription>
            Categoria: {template.category} • 
            Creato: {format(new Date(template.created_at), "d MMMM yyyy", { locale: it })}
            {template.user?.full_name && ` • Da: ${template.user.full_name}`}
          </DialogDescription>
        </DialogHeader>
        
        {template.description && (
          <div className="py-2">
            <p className="text-sm">{template.description}</p>
          </div>
        )}
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">#</TableHead>
                <TableHead>Esercizio</TableHead>
                <TableHead className="w-[80px]">Serie</TableHead>
                <TableHead className="w-[100px]">Ripetizioni</TableHead>
                <TableHead>Note</TableHead>
                <TableHead className="w-[80px]">Video</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {template.template_exercises?.sort((a, b) => a.order_index - b.order_index).map((ex) => (
                <TableRow key={ex.id}>
                  <TableCell>{ex.order_index}</TableCell>
                  <TableCell>{ex.exercise?.name}</TableCell>
                  <TableCell>{ex.sets}</TableCell>
                  <TableCell>{ex.reps}</TableCell>
                  <TableCell>{ex.notes}</TableCell>
                  <TableCell>
                    {ex.exercise?.video_url ? (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        asChild
                        className="text-blue-500"
                      >
                        <a href={ex.exercise.video_url} target="_blank" rel="noopener noreferrer">
                          <Video className="h-4 w-4" />
                        </a>
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="border rounded-md p-4 flex flex-col">
            <div className="flex items-center text-sm font-medium mb-3">
              <TrendingUp className="h-4 w-4 mr-2 text-primary" />
              Statistiche di Utilizzo
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Assegnazioni:</span>
                <span className="text-sm font-medium">{template.assignment_count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tasso di conversione:</span>
                <span className="text-sm font-medium">30%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Tempo medio follow-up:</span>
                <span className="text-sm font-medium">3.5 giorni</span>
              </div>
            </div>
          </div>
          
          <div className="border rounded-md p-4 flex flex-col">
            <div className="flex items-center text-sm font-medium mb-3">
              <Users className="h-4 w-4 mr-2 text-primary" />
              Utilizzo Trainer
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Trainer principale:</span>
                <span className="text-sm font-medium">Trainer Name</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">% senza follow-up:</span>
                <span className="text-sm font-medium">15%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Ultima assegnazione:</span>
                <span className="text-sm font-medium">
                  {template.assignment_count ? format(new Date(), "d MMM yyyy", { locale: it }) : '-'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground mt-2">
          {template.assignment_count 
            ? `Questa scheda è stata assegnata ${template.assignment_count} volta/e` 
            : "Questa scheda non è mai stata assegnata"
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}
