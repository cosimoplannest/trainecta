
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Room } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const roomSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  capacity: z.coerce.number().min(1, "La capacità deve essere almeno 1"),
  is_bookable: z.boolean().default(false),
  type: z.string().optional(),
});

type FormData = z.infer<typeof roomSchema>;

interface RoomFormProps {
  room?: Room;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export function RoomForm({ room, onSubmit, onCancel }: RoomFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: room?.name || "",
      capacity: room?.capacity || 0,
      is_bookable: room?.is_bookable || false,
      type: room?.type || "",
    },
  });

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome sala</FormLabel>
              <FormControl>
                <Input placeholder="Es. Sala pesi" {...field} />
              </FormControl>
              <FormDescription>
                Nome identificativo della sala
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacità</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  min={1} 
                  placeholder="Es. 30" 
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Numero massimo di persone che possono accedere alla sala
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="weights">Sala pesi</SelectItem>
                  <SelectItem value="cardio">Cardio</SelectItem>
                  <SelectItem value="functional">Functional</SelectItem>
                  <SelectItem value="course">Sala corsi</SelectItem>
                  <SelectItem value="other">Altro</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Tipologia di sala (opzionale)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="is_bookable"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Prenotabile</FormLabel>
                <FormDescription>
                  Indica se la sala è prenotabile tramite sistema di prenotazione
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Annulla
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvataggio..." : (room ? "Aggiorna" : "Crea")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
