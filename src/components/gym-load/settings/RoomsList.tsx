
import { useState } from "react";
import { useRooms } from "../hooks/useRooms";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Loader2, Check, X } from "lucide-react";
import { RoomForm } from "./RoomForm";
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

export function RoomsList() {
  const { rooms, loading, createRoom, updateRoom, deleteRoom } = useRooms();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);

  const handleCreateRoom = async (data: any) => {
    await createRoom(data);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateRoom = async (id: string, data: any) => {
    await updateRoom(id, data);
    setEditingRoom(null);
  };

  const handleDeleteRoom = async (id: string) => {
    await deleteRoom(id);
  };

  const roomTypeLabels: Record<string, string> = {
    weights: "Sala pesi",
    cardio: "Cardio",
    functional: "Functional",
    course: "Sala corsi",
    other: "Altro",
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sale e Spazi</CardTitle>
          <CardDescription>
            Gestisci le sale e gli spazi della tua palestra
          </CardDescription>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <PlusCircle className="mr-2 h-4 w-4" />
              Aggiungi sala
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Aggiungi sala</DialogTitle>
              <DialogDescription>
                Inserisci i dettagli della nuova sala
              </DialogDescription>
            </DialogHeader>
            <RoomForm 
              onSubmit={handleCreateRoom} 
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
        ) : rooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-muted-foreground">
              Non ci sono sale configurate
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Aggiungi la prima sala
            </Button>
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Capacità</TableHead>
                  <TableHead>Prenotabile</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell className="font-medium">{room.name}</TableCell>
                    <TableCell>
                      {room.type ? roomTypeLabels[room.type] || room.type : "—"}
                    </TableCell>
                    <TableCell>{room.capacity}</TableCell>
                    <TableCell>
                      {room.is_bookable ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => setEditingRoom(room.id)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                          <DialogHeader>
                            <DialogTitle>Modifica sala</DialogTitle>
                            <DialogDescription>
                              Modifica i dettagli della sala
                            </DialogDescription>
                          </DialogHeader>
                          <RoomForm 
                            room={room}
                            onSubmit={(data) => handleUpdateRoom(room.id, data)} 
                            onCancel={() => setEditingRoom(null)} 
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
                              Questa operazione non può essere annullata. Assicurati che non ci siano corsi associati a questa sala prima di eliminarla.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annulla</AlertDialogCancel>
                            <AlertDialogAction 
                              className="bg-red-600"
                              onClick={() => handleDeleteRoom(room.id)}
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
        )}
      </CardContent>
    </Card>
  );
}
