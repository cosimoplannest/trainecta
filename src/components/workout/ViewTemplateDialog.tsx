
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
import { ExternalLink, Video } from "lucide-react";
import { format } from "date-fns";
import { it } from "date-fns/locale";
import { WorkoutTemplate } from "@/types/workout";

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
