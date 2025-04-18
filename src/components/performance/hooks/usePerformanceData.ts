
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PerformanceData {
  id: string;
  name: string;
  total: number;
  conversions: number;
  rate: number;
}

export const usePerformanceData = (period: string, viewType: string) => {
  return useQuery({
    queryKey: ["performance", period, viewType],
    queryFn: async () => {
      try {
        if (viewType === "trainers") {
          const { data: followups, error } = await supabase
            .from("client_followups")
            .select(`
              trainer_id,
              trainer:users!client_followups_trainer_id_fkey(full_name),
              purchase_confirmed
            `)
            .order("trainer_id", { ascending: true });
            
          if (error) throw error;
          
          const trainerStats = followups.reduce((acc: any, curr: any) => {
            const trainerId = curr.trainer_id;
            const trainerName = curr.trainer?.full_name || "Non assegnato";
            
            if (!acc[trainerId]) {
              acc[trainerId] = {
                id: trainerId,
                name: trainerName,
                total: 0,
                conversions: 0,
                rate: 0
              };
            }
            
            acc[trainerId].total += 1;
            if (curr.purchase_confirmed) {
              acc[trainerId].conversions += 1;
            }
            
            return acc;
          }, {});
          
          return Object.values(trainerStats).map((trainer: any) => {
            trainer.rate = trainer.total > 0 
              ? Math.round((trainer.conversions / trainer.total) * 100) 
              : 0;
            return trainer;
          });
        } else {
          const { data: templates, error } = await supabase
            .from("assigned_templates")
            .select(`
              template_id,
              template:workout_templates(name),
              conversion_status
            `)
            .order("template_id", { ascending: true });
            
          if (error) throw error;
          
          const templateStats = templates.reduce((acc: any, curr: any) => {
            const templateId = curr.template_id;
            const templateName = curr.template?.name || "Template rimosso";
            
            if (!acc[templateId]) {
              acc[templateId] = {
                id: templateId,
                name: templateName,
                total: 0,
                conversions: 0,
                rate: 0
              };
            }
            
            acc[templateId].total += 1;
            if (curr.conversion_status === "converted") {
              acc[templateId].conversions += 1;
            }
            
            return acc;
          }, {});
          
          return Object.values(templateStats).map((template: any) => {
            template.rate = template.total > 0 
              ? Math.round((template.conversions / template.total) * 100) 
              : 0;
            return template;
          });
        }
      } catch (error) {
        console.error(`Error fetching ${viewType} performance data:`, error);
        toast.error(`Errore nel caricamento dei dati di performance`);
        return [];
      }
    }
  });
};
