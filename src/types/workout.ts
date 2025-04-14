
// Define workout type enum
export type WorkoutType = 'full_body' | 'upper_body' | 'lower_body' | 'push' | 'pull' | 'legs' | 'core' | 'cardio' | 'circuit' | 'arms' | 'shoulders' | 'back' | 'chest';

// Interfaces
export interface Exercise {
  id: string;
  name: string;
  description?: string;
  video_url?: string;
}

// Base template exercise interface with properties common to both local and API responses
export interface BaseTemplateExercise {
  id: string;
  sets: number;
  reps: string;
  order_index: number;
  notes?: string;
}

// Template exercise interface for creating/sending data to API
export interface TemplateExercise extends BaseTemplateExercise {
  exercise_id: string;
  exercise?: Exercise;
}

// Template exercise interface as returned from the API
export interface TemplateExerciseWithNestedExercise extends BaseTemplateExercise {
  exercise: Exercise;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  category: string;
  description?: string;
  created_at: string;
  created_by?: string;
  user?: { full_name: string };
  locked: boolean;
  type?: WorkoutType;
  gym_id: string;
  template_exercises?: (TemplateExercise | TemplateExerciseWithNestedExercise)[];
  assignment_count?: number;
  is_default?: boolean;
  updated_at?: string;
}

export interface AssignedTemplate {
  id: string;
  template_id: string;
  client_id: string;
  assigned_by: string;
  assigned_at: string;
  delivery_channel: string;
  delivery_status: string;
  workout_template: WorkoutTemplate;
  assigned_by_user: {
    full_name: string;
  };
  followup_notes?: string;
  conversion_status?: string;
}
