
import { useState } from "react";
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
import { Check, Edit, Plus, Search, Trash2, File, Copy, EyeIcon } from "lucide-react";
import { toast } from "sonner";

// Tipo per gli esercizi
interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  videoUrl?: string;
}

// Tipo per i template di allenamento
interface WorkoutTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  exercises: Exercise[];
  createdAt: Date;
  createdBy: string;
}

const WorkoutTemplates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([
    {
      id: "1",
      name: "Allenamento Dorsali Base",
      category: "Dorso",
      description: "Allenamento per principianti focalizzato sui dorsali",
      exercises: [
        { id: "ex1", name: "Lat Machine", sets: 3, reps: "10-12" },
        { id: "ex2", name: "Rematore su Panca", sets: 3, reps: "12" },
        { id: "ex3", name: "Pull Down", sets: 3, reps: "12-15" }
      ],
      createdAt: new Date(2024, 3, 10),
      createdBy: "Mario Rossi"
    },
    {
      id: "2",
      name: "Gambe Principianti",
      category: "Gambe",
      description: "Allenamento gambe per principianti",
      exercises: [
        { id: "ex4", name: "Leg Press", sets: 3, reps: "12-15" },
        { id: "ex5", name: "Leg Extension", sets: 3, reps: "12" },
        { id: "ex6", name: "Leg Curl", sets: 3, reps: "12" }
      ],
      createdAt: new Date(2024, 3, 12),
      createdBy: "Giulia Bianchi"
    }
  ]);
  
  const [newTemplate, setNewTemplate] = useState<Partial<WorkoutTemplate>>({
    name: "",
    category: "",
    description: "",
    exercises: []
  });
  
  const [newExercise, setNewExercise] = useState<Partial<Exercise>>({
    name: "",
    sets: 3,
    reps: "12"
  });

  // Filtra i template in base alla ricerca
  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Aggiunge un nuovo esercizio al template in fase di creazione
  const addExercise = () => {
    if (!newExercise.name) {
      toast.error("Inserisci il nome dell'esercizio");
      return;
    }
    
    setNewTemplate({
      ...newTemplate,
      exercises: [
        ...newTemplate.exercises || [],
        { ...newExercise, id: `ex-${Date.now()}` } as Exercise
      ]
    });
    
    setNewExercise({
      name: "",
      sets: 3,
      reps: "12"
    });
  };

  // Rimuove un esercizio dal template in fase di creazione
  const removeExercise = (id: string) => {
    setNewTemplate({
      ...newTemplate,
      exercises: newTemplate.exercises?.filter(ex => ex.id !== id)
    });
  };

  // Crea un nuovo template
  const createTemplate = () => {
    if (!newTemplate.name || !newTemplate.category) {
      toast.error("Inserisci nome e categoria");
      return;
    }
    
    if (!newTemplate.exercises?.length) {
      toast.error("Aggiungi almeno un esercizio");
      return;
    }
    
    const template: WorkoutTemplate = {
      id: `template-${Date.now()}`,
      name: newTemplate.name,
      category: newTemplate.category,
      description: newTemplate.description || "",
      exercises: newTemplate.exercises,
      createdAt: new Date(),
      createdBy: "Utente Attuale"
    };
    
    setTemplates([...templates, template]);
    setNewTemplate({
      name: "",
      category: "",
      description: "",
      exercises: []
    });
    
    setIsCreating(false);
    toast.success("Template creato con successo");
  };

  // Duplica un template esistente
  const duplicateTemplate = (template: WorkoutTemplate) => {
    const duplicated: WorkoutTemplate = {
      ...template,
      id: `template-${Date.now()}`,
      name: `${template.name} (Copia)`,
      createdAt: new Date()
    };
    
    setTemplates([...templates, duplicated]);
    toast.success("Template duplicato con successo");
  };

  // Elimina un template
  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast.success("Template eliminato con successo");
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
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
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
              
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-3">Aggiungi Esercizi</h4>
                  
                  <div className="grid grid-cols-6 gap-2 mb-3">
                    <div className="col-span-3">
                      <Input 
                        placeholder="Nome esercizio" 
                        value={newExercise.name} 
                        onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <Input 
                        type="number" 
                        placeholder="Serie" 
                        value={newExercise.sets} 
                        onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                      />
                    </div>
                    <div>
                      <Input 
                        placeholder="Ripetizioni" 
                        value={newExercise.reps} 
                        onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                      />
                    </div>
                    <div>
                      <Button onClick={addExercise} className="w-full">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {newTemplate.exercises && newTemplate.exercises.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Esercizio</TableHead>
                            <TableHead className="w-[80px]">Serie</TableHead>
                            <TableHead className="w-[100px]">Ripetizioni</TableHead>
                            <TableHead className="w-[60px]"></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {newTemplate.exercises.map((exercise) => (
                            <TableRow key={exercise.id}>
                              <TableCell>{exercise.name}</TableCell>
                              <TableCell>{exercise.sets}</TableCell>
                              <TableCell>{exercise.reps}</TableCell>
                              <TableCell>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => removeExercise(exercise.id)}
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
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Annulla</Button>
              <Button onClick={createTemplate}>Crea Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
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
                      <Button variant="ghost" size="icon">
                        <EyeIcon className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => duplicateTemplate(template)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                    
                    <div className="text-xs text-muted-foreground">
                      {template.exercises.length} esercizi • Creato: {template.createdAt.toLocaleDateString()}
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
                          {template.exercises.map((exercise) => (
                            <TableRow key={exercise.id}>
                              <TableCell className="py-1.5">{exercise.name}</TableCell>
                              <TableCell className="text-right py-1.5">{exercise.sets} × {exercise.reps}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="flex justify-end pt-2">
                      <Button size="sm" className="gap-1">
                        <File className="h-4 w-4" />
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
      </div>
    </div>
  );
};

export default WorkoutTemplates;
