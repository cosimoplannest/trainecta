
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ClientFormData, clientFormSchema } from "../schemas/clientFormSchema";

export const useClientForm = (onClientAdded: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [trainers, setTrainers] = useState<{ id: string; full_name: string }[]>([]);
  const [subscriptions, setSubscriptions] = useState<{ id: string; name: string }[]>([]);
  const { toast } = useToast();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      gender: undefined,
      address: "",
      fiscal_code: "",
      source: undefined,
      subscription_duration: undefined,
      preferred_time: undefined,
      primary_goal: undefined,
      fitness_level: undefined,
      internal_notes: "",
      joined_at: new Date(),
    },
  });

  // Fetch trainers and subscriptions when component mounts
  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const { data, error } = await supabase
          .from("users")
          .select("id, full_name")
          .eq("role", "trainer");

        if (error) throw error;
        setTrainers(data || []);
      } catch (error) {
        console.error("Error fetching trainers:", error);
      }
    };

    const fetchSubscriptions = async () => {
      try {
        const { data, error } = await supabase
          .from("subscriptions")
          .select("id, name");

        if (error) throw error;
        setSubscriptions(data || []);
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      }
    };

    fetchTrainers();
    fetchSubscriptions();
  }, []);

  const onSubmit = async (data: ClientFormData) => {
    setIsSubmitting(true);
    try {
      // Format date properly for database
      const formattedData = {
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email || null,
        phone: data.phone || null,
        gender: data.gender || null,
        birth_date: data.birth_date ? data.birth_date.toISOString() : null,
        fiscal_code: data.fiscal_code || null,
        address: data.address || null,
        joined_at: data.joined_at.toISOString(),
        subscription_id: data.subscription_id || null,
        subscription_duration: data.subscription_duration || null,
        subscription_start_date: data.subscription_start_date ? data.subscription_start_date.toISOString() : null,
        subscription_end_date: data.subscription_end_date ? data.subscription_end_date.toISOString() : null,
        preferred_time: data.preferred_time || null,
        primary_goal: data.primary_goal || null,
        fitness_level: data.fitness_level || null,
        assigned_to: data.assigned_to || null,
        source: data.source || null,
        internal_notes: data.internal_notes || null,
        // Add the required gym_id field - using a hardcoded value for now
        // In a real app, this would come from user context or similar
        gym_id: "11111111-1111-1111-1111-111111111111"
      };

      const { error } = await supabase.from("clients").insert(formattedData);

      if (error) throw error;

      toast({
        title: "Cliente aggiunto con successo",
        description: `${data.first_name} ${data.last_name} è stato aggiunto.`,
      });

      form.reset();
      onClientAdded();
    } catch (error: any) {
      console.error("Error adding client:", error);
      toast({
        title: "Errore",
        description: `Si è verificato un errore: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    trainers,
    subscriptions,
    isSubmitting,
    onSubmit,
  };
};
