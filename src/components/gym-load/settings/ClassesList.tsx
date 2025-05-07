
import { useState } from "react";
import { useClasses } from "../hooks/useClasses";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Check, X, Calendar } from "lucide-react";
import { ClassForm } from "./ClassForm";
import { format, parse } from "date-fns";
import { it } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ClassesList() {
  const { classes, loading, createClass, updateClass, deleteClass } = useClasses();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<string | null>(null);

  const handleCreateClass = async (data: any) => {
    await createClass(data);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateClass = async (id: string, data: any) => {
    await updateClass(id, data);
    setEditingClass(null);
  };

  const handleDeleteClass = async (id: string) => {
    await deleteClass(id);
  };

  const getDayName = (dayOfWeek: number) => {
    const days = [
      "Domenica", "Lunedì", "Martedì", "Mercoledì", 
      "Giovedì", "Venerdì", "Sabato"
    ];
    return days[dayOfWeek];
  };

  // Group classes by day of week
  const classesByDay = classes.reduce<Record<number, typeof classes>>((acc, gymClass) => {
    if (!acc[gymClass.day_of_week]) {
      acc[gymClass.day_of_week] = [];
    }
    acc[gymClass.day_of_week].push(gymClass);
    return acc;
  }, {});

  // Sort days of week starting from Monday (1)
  const sortedDays = [1, 2, 3, 4, 5, 6, 0].filter(day => classesByDay[day] && classesByDay[day].length > 0);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Corsi</CardTitle>
          <CardDescription>
            Gestisci i corsi della tua palestra
          </CardDescription>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Aggiungi corso
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Aggiungi corso</DialogTitle>
              <DialogDescription>
                Inserisci i dettagli del nuovo corso
              </DialogDescription>
            </DialogHeader>
            <ClassForm 
              onSubmit={handleCreateClass} 
              onCancel={() => setIsCreateDialogOpen(false)} 
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : classes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">
              Non ci sono corsi configurati
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Aggiungi il primo corso
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedDays.map(dayOfWeek => (
              <div key={dayOfWeek} className="border rounded-md">
                <div className="bg-muted px-4 py-2 font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {getDayName(dayOfWeek)}
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Orario</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Sala</TableHead>
                      <TableHead>Capienza</TableHead>
                      <TableHead>Istruttore</TableHead>
                      <TableHead>Azioni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classesByDay[dayOfWeek]
                      .sort((a, b) => a.start_time.localeCompare(b.start_time))
                      .map((gymClass) => (
                        <TableRow key={gymClass.id}>
                          <TableCell>
                            {gymClass.start_time.substring(0, 5)} - {gymClass.end_time.substring(0, 5)}
                          </TableCell>
                          <TableCell className="font-medium">{gymClass.name}</TableCell>
                          <TableCell>{gymClass.room?.name || "—"}</TableCell>
                          <TableCell>{gymClass.max_capacity}</TableCell>
                          <TableCell>{gymClass.instructor?.full_name || "—"}</TableCell>
                          <TableCell className="space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => setEditingClass(gymClass.id)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[500px]">
                                <DialogHeader>
                                  <DialogTitle>Modifica corso</DialogTitle>
                                  <DialogDescription>
                                    Modifica i dettagli del corso
                                  </DialogDescription>
                                </DialogHeader>
                                <ClassForm 
                                  gymClass={gymClass}
                                  onSubmit={(data) => handleUpdateClass(gymClass.id, data)} 
                                  onCancel={() => setEditingClass(null)} 
                                />
                              </DialogContent>
                            </Dialog>

                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon" className="text-red-600">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Sei sicuro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Questa operazione non può essere annullata. Eliminerai il corso e tutti i dati di presenza associati.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                                  <AlertDialogAction 
                                    className="bg-red-600"
                                    onClick={() => handleDeleteClass(gymClass.id)}
                                  >
                                    Elimina
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
