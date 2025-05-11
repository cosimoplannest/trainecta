
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { GymClass, Room } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { useRooms } from "../hooks/useRooms";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
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

const classSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  room_id: z.string().min(1, "Seleziona una sala"),
  instructor_id: z.string().nullable(),
  day_of_week: z.coerce.number().min(0).max(6),
  start_time: z.string().min(1, "Orario di inizio obbligatorio"),
  end_time: z.string().min(1, "Orario di fine obbligatorio"),
  max_capacity: z.coerce.number().min(1, "La capacità deve essere almeno 1"),
  requires_booking: z.boolean().default(true),
});

type FormData = z.infer<typeof classSchema>;

interface ClassFormProps {
  gymClass?: GymClass;
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
}

export function ClassForm({ gymClass, onSubmit, onCancel }: ClassFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { rooms } = useRooms();
  const [trainers, setTrainers] = useState<any[]>([]);
  const { user } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      name: gymClass?.name || "",
      room_id: gymClass?.room_id || "",
      instructor_id: gymClass?.instructor_id || null,
      day_of_week: gymClass?.day_of_week ?? 1,
      start_time: gymClass?.start_time?.substring(0, 5) || "09:00",
      end_time: gymClass?.end_time?.substring(0, 5) || "10:00",
      max_capacity: gymClass?.max_capacity || 0,
      requires_booking: gymClass?.requires_booking ?? true,
    },
  });

  useEffect(() => {
    const fetchTrainers = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, full_name, role')
          .in('role', ['trainer', 'instructor'])
          .order('full_name');
        
        if (error) throw error;
        setTrainers(data || []);
      } catch (error) {
        console.error('Error fetching trainers:', error);
      }
    };
    
    fetchTrainers();
  }, [user]);

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const dayOptions = [
    { value: 1, label: 'Lunedì' },
    { value: 2, label: 'Martedì' },
    { value: 3, label: 'Mercoledì' },
    { value: 4, label: 'Giovedì' },
    { value: 5, label: 'Venerdì' },
    { value: 6, label: 'Sabato' },
    { value: 0, label: 'Domenica' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome corso</FormLabel>
              <FormControl>
                <Input placeholder="Es. Yoga" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="day_of_week"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giorno</FormLabel>
                <Select
                  value={field.value.toString()}
                  onValueChange={(value) => field.onChange(parseInt(value, 10))}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona un giorno" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {dayOptions.map((day) => (
                      <SelectItem key={day.value} value={day.value.toString()}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="room_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sala</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona una sala" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name} ({room.capacity} posti)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="start_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orario inizio</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="end_time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orario fine</FormLabel>
                <FormControl>
                  <Input 
                    type="time" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="instructor_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Istruttore</FormLabel>
                <Select
                  value={field.value || "null"}
                  onValueChange={(val) => field.onChange(val === "null" ? null : val)}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleziona un istruttore" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="null">Nessuno</SelectItem>
                    {trainers.map((trainer) => (
                      <SelectItem key={trainer.id} value={trainer.id}>
                        {trainer.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Opzionale - Istruttore che terrà il corso
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="max_capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capienza massima</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min={1} 
                    placeholder="Es. 20" 
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Numero massimo di partecipanti
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="requires_booking"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Richiede prenotazione</FormLabel>
                <FormDescription>
                  Indica se il corso richiede una prenotazione preventiva
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
            {isSubmitting ? "Salvataggio..." : (gymClass ? "Aggiorna" : "Crea")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
