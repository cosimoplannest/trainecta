
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Check, Edit, Plus, Search, Trash2, File, Copy, EyeIcon, Video, Users } from "lucide-react";
import { toast } from "sonner";
import { CreateExerciseDialog } from "@/components/workout/CreateExerciseDialog";
import { AssignTemplateDialog } from "@/components/workout/AssignTemplateDialog";
import { ViewTemplateDialog } from "@/components/workout/ViewTemplateDialog";

// Define workout type enum
type WorkoutType = 'full_body' | 'upper_body' | 'lower_body' | 'push' | 'pull' | 'legs' | 'core' | 'cardio' | 'circuit' | 'arms' | 'shoulders' | 'back' | 'chest';

// Interfaces
interface Exercise {
  id: string;
  name: string;
  description?: string;
  video_url?: string;
}

interface TemplateExercise {
  id: string;
  exercise_id?: string;
  exercise?: Exercise;
  sets: number;
  reps: string;
  order_index: number;
  notes?: string;
}

interface WorkoutTemplate {
  id: string;
  name: string;
  category: string;
  description?: string;
  created_at: string;
  created_by?: string;
  user?: { full_name: string };
  locked: boolean;
  type?: WorkoutType | string;
  gym_id: string;
  template_exercises?: TemplateExercise[];
  assignment_count?: number;
  is_default?: boolean;
  updated_at?: string;
}

const WorkoutTemplates = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [isAddingExercises, setIsAddingExercises] = useState(false);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newTemplate, setNewTemplate] = useState<Partial<WorkoutTemplate>>({
    name: "",
    category: "",
    description: "",
    type: "full_body"
  });
  
  const [currentTemplate, setCurrentTemplate] = useState<WorkoutTemplate | null>(null);
  const [templateExercises, setTemplateExercises] = useState<TemplateExercise[]>([]);
  const [isViewingTemplate, setIsViewingTemplate] = useState(false);
  const [isAssigningTemplate, setIsAssigningTemplate] = useState(false);

  // New exercise being added to a template
  const [newExercise, setNewExercise] = useState<Partial<TemplateExercise>>({
    sets: 3,
    reps: "12",
    order_index: 1,
    exercise_id: ""
  });

  // Fetch templates and exercises
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch templates with assignment counts and creator info
        const { data: templatesData, error: templatesError } = await supabase
          .from("workout_templates")
          .select(`
            *,
            user:users!workout_templates_created_by_fkey(full_name),
            template_exercises(
              id,
              sets,
              reps,
              order_index,
              notes,
              exercise:exercises(id, name, description, video_url)
            )
          `)
          .order("created_at", { ascending: false });

        if (templatesError) throw templatesError;

        // Get assignment counts for each template
        const templatesWithCounts = await Promise.all(
          templatesData.map(async (template) => {
            const { count, error } = await supabase
              .from("assigned_templates")
              .select("*", { count: "exact", head: true })
              .eq("template_id", template.id);

            return {
              ...template,
              assignment_count: count || 0
            } as WorkoutTemplate;
          })
        );

        setTemplates(templatesWithCounts);

        // Fetch exercises
        const { data: exercisesData, error: exercisesError } = await supabase
          .from("exercises")
          .select("*")
          .order("name");

        if (exercisesError) throw exercisesError;
        setExercises(exercisesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        uiToast({
          title: "Errore",
          description: "Impossibile caricare i dati",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uiToast]);

  // Filter templates based on search query
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create new template
  const createTemplate = async () => {
    if (!newTemplate.name || !newTemplate.category) {
      toast.error("Inserisci nome e categoria");
      return;
    }
    
    try {
      // Creating template
      const { data, error } = await supabase
        .from("workout_templates")
        .insert({
          name: newTemplate.name,
          category: newTemplate.category,
          description: newTemplate.description,
          type: newTemplate.type as WorkoutType || "full_body",
          gym_id: "11111111-1111-1111-1111-111111111111", // Hardcoded for now
          locked: false, // Set to false initially to allow adding exercises
        })
        .select()
        .single();

      if (error) throw error;
      
      // Set as current template and move to adding exercises
      setCurrentTemplate(data as WorkoutTemplate);
      setIsCreatingTemplate(false);
      setIsAddingExercises(true);
      toast.success("Template creato con successo. Ora aggiungi gli esercizi.");
    } catch (error) {
      console.error("Error creating template:", error);
      toast.error("Errore durante la creazione del template");
    }
  };

  // Add exercise to template
  const addExerciseToTemplate = async () => {
    if (!currentTemplate || !newExercise.exercise_id) {
      toast.error("Seleziona un esercizio");
      return;
    }
    
    if (!newExercise.sets || !newExercise.reps) {
      toast.error("Inserisci serie e ripetizioni");
      return;
    }
    
    try {
      // Get the next order index
      const order_index = templateExercises.length + 1;
      
      // Insert template exercise
      const { data, error } = await supabase
        .from("template_exercises")
        .insert({
          template_id: currentTemplate.id,
          exercise_id: newExercise.exercise_id,
          sets: newExercise.sets,
          reps: newExercise.reps,
          notes: newExercise.notes,
          order_index
        })
        .select(`
          *,
          exercise:exercises(id, name, description, video_url)
        `)
        .single();

      if (error) throw error;
      
      // Update local state
      setTemplateExercises([...templateExercises, data]);
      
      // Reset form for next exercise
      setNewExercise({
        sets: 3,
        reps: "12",
        order_index: order_index + 1,
        exercise_id: "",
        notes: ""
      });
      
      toast.success("Esercizio aggiunto");
    } catch (error) {
      console.error("Error adding exercise:", error);
      toast.error("Errore durante l'aggiunta dell'esercizio");
    }
  };

  // Remove exercise from template
  const removeExerciseFromTemplate = async (id: string) => {
    if (!currentTemplate) return;
    
    try {
      const { error } = await supabase
        .from("template_exercises")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // Update local state
      setTemplateExercises(templateExercises.filter(ex => ex.id !== id));
      toast.success("Esercizio rimosso");
    } catch (error) {
      console.error("Error removing exercise:", error);
      toast.error("Errore durante la rimozione dell'esercizio");
    }
  };

  // Finalize template
  const finalizeTemplate = async () => {
    if (!currentTemplate) return;
    
    if (templateExercises.length === 0) {
      toast.error("Aggiungi almeno un esercizio");
      return;
    }
    
    try {
      // Lock the template
      const { error } = await supabase
        .from("workout_templates")
        .update({ locked: true })
        .eq("id", currentTemplate.id);

      if (error) throw error;
      
      // Log activity
      await supabase.from("activity_logs").insert({
        action: "template_created",
        target_id: currentTemplate.id,
        target_type: "workout_template",
        gym_id: "11111111-1111-1111-1111-111111111111", // Hardcoded for now
        notes: `Template '${currentTemplate.name}' creato con ${templateExercises.length} esercizi`
      });
      
      // Reset and refresh
      setIsAddingExercises(false);
      setCurrentTemplate(null);
      setTemplateExercises([]);
      
      // Refresh templates list
      const { data, error: refreshError } = await supabase
        .from("workout_templates")
        .select(`
          *,
          user:users!workout_templates_created_by_fkey(full_name),
          template_exercises(
            id,
            sets,
            reps,
            order_index,
            notes,
            exercise:exercises(id, name, description, video_url)
          )
        `)
        .eq("id", currentTemplate.id)
        .single();
        
      if (refreshError) throw refreshError;
      
      // Update local state
      setTemplates(templates.map(t => t.id === data.id ? {...data, assignment_count: 0} as WorkoutTemplate : t));
      
      toast.success("Template finalizzato con successo");
    } catch (error) {
      console.error("Error finalizing template:", error);
      toast.error("Errore durante la finalizzazione del template");
    }
  };

  // Delete template
  const deleteTemplate = async (id: string) => {
    // Find template to check assignments
    const template = templates.find(t => t.id === id);
    if (!template) return;
    
    if (template.assignment_count && template.assignment_count > 0) {
      toast.error("Non è possibile eliminare un template già assegnato a dei clienti");
      return;
    }
    
    try {
      // Delete template
      const { error } = await supabase
        .from("workout_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      // Update local state
      setTemplates(templates.filter(t => t.id !== id));
      toast.success("Template eliminato con successo");
    } catch (error) {
      console.error("Error deleting template:", error);
      toast.error("Errore durante l'eliminazione del template");
    }
  };

  // Handle new exercise added
  const handleExerciseAdded = (exercise: Exercise) => {
    setExercises([...exercises, exercise]);
    // Automatically select the new exercise
    setNewExercise({...newExercise, exercise_id: exercise.id});
  };

  // View template details
  const viewTemplate = (template: WorkoutTemplate) => {
    setCurrentTemplate(template);
    setIsViewingTemplate(true);
  };

  // Assign template to client
  const assignTemplate = (template: WorkoutTemplate) => {
    setCurrentTemplate(template);
    setIsAssigningTemplate(true);
  };

  // Handle template assigned
  const handleTemplateAssigned = async () => {
    // Refresh the assignment count
    if (currentTemplate) {
      const { count } = await supabase
        .from("assigned_templates")
        .select("*", { count: "exact", head: true })
        .eq("template_id", currentTemplate.id);
        
      setTemplates(templates.map(t => 
        t.id === currentTemplate.id ? {...t, assignment_count: count || 0} : t
      ));
    }
  };

  // Duplicate template
  const duplicateTemplate = async (template: WorkoutTemplate) => {
    try {
      // Create new template
      const { data: newTemplate, error: templateError } = await supabase
        .from("workout_templates")
        .insert({
          name: `${template.name} (Copia)`,
          category: template.category,
          description: template.description,
          type: template.type,
          gym_id: template.gym_id,
          locked: false
        })
        .select()
        .single();
        
      if (templateError) throw templateError;
      
      // Get exercises from original template
      const { data: exercises, error: exercisesError } = await supabase
        .from("template_exercises")
        .select("*")
        .eq("template_id", template.id);
        
      if (exercisesError) throw exercisesError;
      
      // Insert exercises for new template
      if (exercises.length > 0) {
        const newExercises = exercises.map(ex => ({
          template_id: newTemplate.id,
          exercise_id: ex.exercise_id,
          sets: ex.sets,
          reps: ex.reps,
          notes: ex.notes,
          order_index: ex.order_index
        }));
        
        const { error: insertError } = await supabase
          .from("template_exercises")
          .insert(newExercises);
          
        if (insertError) throw insertError;
      }
      
      // Add to local state
      const { data: fullTemplate, error: refreshError } = await supabase
        .from("workout_templates")
        .select(`
          *,
          user:users!workout_templates_created_by_fkey(full_name),
          template_exercises(
            id,
            sets,
            reps,
            order_index,
            notes,
            exercise:exercises(id, name, description, video_url)
          )
        `)
        .eq("id", newTemplate.id)
        .single();
        
      if (refreshError) throw refreshError;
      
      setTemplates([{...fullTemplate, assignment_count: 0}, ...templates]);
      toast.success("Template duplicato con successo");
    } catch (error) {
      console.error("Error duplicating template:", error);
      toast.error("Errore durante la duplicazione del template");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Modelli di Allenamento</h2>
          <p className="text-muted-foreground">
            Gestisci i modelli di allenamento per i tuoi clienti
          </p>
        </div>
        
        <Dialog open={isCreatingTemplate} onOpenChange={setIsCreatingTemplate}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-1">
              <Plus className="h-4 w-4" />
              <span>Nuovo Template</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Crea Nuovo Template di Allenamento</DialogTitle>
              <DialogDescription>
                Crea un nuovo modello di allenamento che potrai assegnare ai tuoi clienti
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Template</Label>
                  <Input 
                    id="name" 
                    value={newTemplate.name} 
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                    placeholder="es. Allenamento Dorsali Base"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select 
                    onValueChange={(value) => setNewTemplate({ ...newTemplate, category: value })}
                    value={newTemplate.category}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Seleziona categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Petto">Petto</SelectItem>
                      <SelectItem value="Dorso">Dorso</SelectItem>
                      <SelectItem value="Gambe">Gambe</SelectItem>
                      <SelectItem value="Spalle">Spalle</SelectItem>
                      <SelectItem value="Braccia">Braccia</SelectItem>
                      <SelectItem value="Core">Core</SelectItem>
                      <SelectItem value="Full Body">Full Body</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Descrizione</Label>
                <Textarea 
                  id="description" 
                  value={newTemplate.description} 
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Descrivi brevemente questo template di allenamento"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Tipo</Label>
                <Select 
                  onValueChange={(value) => setNewTemplate({ ...newTemplate, type: value })}
                  value={newTemplate.type}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Seleziona tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_body">Full Body</SelectItem>
                    <SelectItem value="upper_body">Upper Body</SelectItem>
                    <SelectItem value="lower_body">Lower Body</SelectItem>
                    <SelectItem value="push">Push</SelectItem>
                    <SelectItem value="pull">Pull</SelectItem>
                    <SelectItem value="legs">Legs</SelectItem>
                    <SelectItem value="core">Core</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="circuit">Circuito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreatingTemplate(false)}>Annulla</Button>
              <Button onClick={createTemplate}>Procedi agli Esercizi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Dialog for adding exercises to a new template */}
      <Dialog open={isAddingExercises} onOpenChange={(open) => {
        if (!open && currentTemplate && templateExercises.length > 0) {
          // Confirm before closing if there are exercises added
          if (window.confirm("Vuoi finalizzare il template?")) {
            finalizeTemplate();
          } else {
            setIsAddingExercises(false);
          }
        } else if (!open) {
          setIsAddingExercises(false);
        }
      }}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Aggiungi Esercizi al Template</DialogTitle>
            <DialogDescription>
              {currentTemplate?.name} - {templateExercises.length} esercizi aggiunti
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="border rounded-md p-4">
              <h4 className="text-sm font-medium mb-3">Aggiungi Esercizi</h4>
              
              <div className="grid grid-cols-12 gap-2 mb-3">
                <div className="col-span-5">
                  <div className="flex items-center gap-2">
                    <Select 
                      value={newExercise.exercise_id} 
                      onValueChange={(value) => setNewExercise({ ...newExercise, exercise_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleziona esercizio" />
                      </SelectTrigger>
                      <SelectContent>
                        {exercises.map((exercise) => (
                          <SelectItem key={exercise.id} value={exercise.id}>
                            {exercise.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <CreateExerciseDialog onExerciseAdded={handleExerciseAdded} />
                  </div>
                </div>
                <div className="col-span-2">
                  <Input 
                    type="number" 
                    placeholder="Serie" 
                    value={newExercise.sets} 
                    onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                  />
                </div>
                <div className="col-span-2">
                  <Input 
                    placeholder="Ripetizioni" 
                    value={newExercise.reps} 
                    onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                  />
                </div>
                <div className="col-span-3">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Note" 
                      value={newExercise.notes} 
                      onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                    />
                    <Button onClick={addExerciseToTemplate}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {templateExercises.length > 0 ? (
                <div className="border rounded-md overflow-hidden mt-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Esercizio</TableHead>
                        <TableHead className="w-[80px]">Serie</TableHead>
                        <TableHead className="w-[100px]">Ripetizioni</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead className="w-[60px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {templateExercises
                        .sort((a, b) => a.order_index - b.order_index)
                        .map((exercise) => (
                        <TableRow key={exercise.id}>
                          <TableCell>{exercise.order_index}</TableCell>
                          <TableCell className="flex items-center gap-2">
                            {exercise.exercise?.name}
                            {exercise.exercise?.video_url && (
                              <Video className="h-4 w-4 text-blue-500" />
                            )}
                          </TableCell>
                          <TableCell>{exercise.sets}</TableCell>
                          <TableCell>{exercise.reps}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            {exercise.notes}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeExerciseFromTemplate(exercise.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Nessun esercizio aggiunto
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              if (window.confirm("Sei sicuro di voler annullare? Tutti gli esercizi aggiunti andranno persi.")) {
                // Delete the template if we cancel
                if (currentTemplate) {
                  deleteTemplate(currentTemplate.id);
                }
                setIsAddingExercises(false);
                setCurrentTemplate(null);
                setTemplateExercises([]);
              }
            }}>Annulla</Button>
            <Button onClick={finalizeTemplate} disabled={templateExercises.length === 0}>
              Finalizza Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Template Assignment Dialog */}
      <AssignTemplateDialog 
        open={isAssigningTemplate} 
        onOpenChange={setIsAssigningTemplate}
        template={currentTemplate}
        onAssigned={handleTemplateAssigned}
      />
      
      {/* Template View Dialog */}
      <ViewTemplateDialog
        open={isViewingTemplate}
        onOpenChange={setIsViewingTemplate}
        template={currentTemplate}
      />
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cerca template..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{template.name}</CardTitle>
                        <CardDescription>Categoria: {template.category}</CardDescription>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => viewTemplate(template)}
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Button>
                        {!template.locked && (
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => duplicateTemplate(template)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        {(!template.assignment_count || template.assignment_count === 0) && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => deleteTemplate(template.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      
                      <div className="text-xs text-muted-foreground">
                        {template.template_exercises?.length || 0} esercizi • Creato: {new Date(template.created_at).toLocaleDateString()}
                        {template.user?.full_name && ` • Da: ${template.user.full_name}`}
                      </div>
                      
                      <div className="border rounded-md overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Esercizio</TableHead>
                              <TableHead className="text-right">Serie × Reps</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {template.template_exercises?.slice(0, 4).map((ex) => (
                              <TableRow key={ex.id}>
                                <TableCell className="py-1.5 flex items-center gap-1">
                                  {ex.exercise?.name}
                                  {ex.exercise?.video_url && (
                                    <Video className="h-3 w-3 text-blue-500" />
                                  )}
                                </TableCell>
                                <TableCell className="text-right py-1.5">{ex.sets} × {ex.reps}</TableCell>
                              </TableRow>
                            ))}
                            {template.template_exercises && template.template_exercises.length > 4 && (
                              <TableRow>
                                <TableCell colSpan={2} className="text-center text-xs text-muted-foreground py-1">
                                  +{template.template_exercises.length - 4} altri esercizi
                                </TableCell>
                              </TableRow>
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <div className="text-xs text-muted-foreground">
                          {template.assignment_count 
                            ? `Assegnato ${template.assignment_count} volta/e` 
                            : "Mai assegnato"
                          }
                        </div>
                        <Button 
                          size="sm" 
                          className="gap-1"
                          onClick={() => assignTemplate(template)}
                        >
                          <Users className="h-4 w-4" />
                          <span>Assegna</span>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <File className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium">Nessun template trovato</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Crea il tuo primo template di allenamento o modifica i criteri di ricerca.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkoutTemplates;
