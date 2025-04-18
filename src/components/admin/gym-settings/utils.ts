import { GymSettingsFormValues, TemplateSentBy } from "./types";

export function normalizeTemplateSentBy(value: string | null): TemplateSentBy {
  if (value === "trainer" || value === "system" || value === "both") {
    return value;
  }
  return "both";
}

export function determineSaleMethods(templateSentBy: string | null): string[] {
  let saleMethods: string[] = ["both"];
  if (templateSentBy === "trainer") {
    saleMethods = ["package"];
  } else if (templateSentBy === "system") {
    saleMethods = ["custom"];
  }
  return saleMethods;
}

export function getDefaultFormValues(): GymSettingsFormValues {
  return {
    name: "",
    address: "",
    city: "",
    postal_code: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    max_trials_per_client: 1,
    enable_auto_followup: true,
    days_to_active_confirmation: 30,
    template_sent_by: "both",
    template_viewable_by_client: true,
    allow_template_duplication: true,
    default_trainer_assignment_logic: "manual",
    sale_methods: ["both"],
    // New post-first-meeting workflow settings
    require_default_template_assignment: true,
    package_confirmation_days: 30,
    custom_plan_confirmation_days: 45,
    notification_channels: ["app"],
    days_to_first_followup: 7,
  };
}
