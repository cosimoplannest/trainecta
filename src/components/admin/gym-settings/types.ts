
export type TemplateSentBy = "trainer" | "system" | "both";
export type SaleMethod = "package" | "custom" | "both";

export type GymSettingsFormValues = {
  name: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  max_trials_per_client: number;
  enable_auto_followup: boolean;
  days_to_first_followup: number;
  days_to_active_confirmation: number;
  template_sent_by: TemplateSentBy;
  template_viewable_by_client: boolean;
  allow_template_duplication: boolean;
  default_trainer_assignment_logic: string;
  sale_methods: string[];
};
