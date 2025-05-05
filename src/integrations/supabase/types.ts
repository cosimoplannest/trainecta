export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          gym_id: string
          id: string
          notes: string | null
          target_id: string | null
          target_type: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          gym_id: string
          id?: string
          notes?: string | null
          target_id?: string | null
          target_type?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          gym_id?: string
          id?: string
          notes?: string | null
          target_id?: string | null
          target_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      assigned_templates: {
        Row: {
          assigned_at: string
          assigned_by: string
          client_id: string
          conversion_status:
            | Database["public"]["Enums"]["conversion_status"]
            | null
          created_at: string
          delivery_channel: string
          delivery_status: string
          followup_done_at: string | null
          followup_notes: string | null
          followup_scheduled_at: string | null
          id: string
          template_id: string
          updated_at: string
        }
        Insert: {
          assigned_at?: string
          assigned_by: string
          client_id: string
          conversion_status?:
            | Database["public"]["Enums"]["conversion_status"]
            | null
          created_at?: string
          delivery_channel: string
          delivery_status: string
          followup_done_at?: string | null
          followup_notes?: string | null
          followup_scheduled_at?: string | null
          id?: string
          template_id: string
          updated_at?: string
        }
        Update: {
          assigned_at?: string
          assigned_by?: string
          client_id?: string
          conversion_status?:
            | Database["public"]["Enums"]["conversion_status"]
            | null
          created_at?: string
          delivery_channel?: string
          delivery_status?: string
          followup_done_at?: string | null
          followup_notes?: string | null
          followup_scheduled_at?: string | null
          id?: string
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assigned_templates_assigned_by_fkey"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assigned_templates_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assigned_templates_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workout_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      broadcast_messages: {
        Row: {
          content: string
          created_at: string
          gym_id: string
          id: string
          priority: Database["public"]["Enums"]["message_priority"] | null
          sent_at: string
          sent_by: string
          target_role: Database["public"]["Enums"]["app_role"] | null
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          gym_id: string
          id?: string
          priority?: Database["public"]["Enums"]["message_priority"] | null
          sent_at?: string
          sent_by: string
          target_role?: Database["public"]["Enums"]["app_role"] | null
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          gym_id?: string
          id?: string
          priority?: Database["public"]["Enums"]["message_priority"] | null
          sent_at?: string
          sent_by?: string
          target_role?: Database["public"]["Enums"]["app_role"] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "broadcast_messages_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "broadcast_messages_sent_by_fkey"
            columns: ["sent_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      client_followups: {
        Row: {
          client_id: string
          created_at: string
          id: string
          notes: string | null
          outcome: string | null
          purchase_confirmed: boolean | null
          sent_at: string
          trainer_id: string | null
          type: Database["public"]["Enums"]["notification_type"]
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          notes?: string | null
          outcome?: string | null
          purchase_confirmed?: boolean | null
          sent_at?: string
          trainer_id?: string | null
          type: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          outcome?: string | null
          purchase_confirmed?: boolean | null
          sent_at?: string
          trainer_id?: string | null
          type?: Database["public"]["Enums"]["notification_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_followups_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_followups_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          assigned_to: string | null
          birth_date: string | null
          created_at: string
          email: string | null
          first_meeting_completed: boolean | null
          first_meeting_date: string | null
          first_name: string
          fiscal_code: string | null
          fitness_level: string | null
          gender: string | null
          gym_id: string
          id: string
          internal_notes: string | null
          joined_at: string | null
          last_confirmation_date: string | null
          last_name: string
          mindbody_id: number
          next_confirmation_due: string | null
          phone: string | null
          preferred_time: string | null
          primary_goal: string | null
          purchase_type: string | null
          source: string | null
          subscription_duration: string | null
          subscription_end_date: string | null
          subscription_id: string | null
          subscription_start_date: string | null
          subscription_type: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          assigned_to?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          first_meeting_completed?: boolean | null
          first_meeting_date?: string | null
          first_name: string
          fiscal_code?: string | null
          fitness_level?: string | null
          gender?: string | null
          gym_id: string
          id?: string
          internal_notes?: string | null
          joined_at?: string | null
          last_confirmation_date?: string | null
          last_name: string
          mindbody_id?: number
          next_confirmation_due?: string | null
          phone?: string | null
          preferred_time?: string | null
          primary_goal?: string | null
          purchase_type?: string | null
          source?: string | null
          subscription_duration?: string | null
          subscription_end_date?: string | null
          subscription_id?: string | null
          subscription_start_date?: string | null
          subscription_type?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          assigned_to?: string | null
          birth_date?: string | null
          created_at?: string
          email?: string | null
          first_meeting_completed?: boolean | null
          first_meeting_date?: string | null
          first_name?: string
          fiscal_code?: string | null
          fitness_level?: string | null
          gender?: string | null
          gym_id?: string
          id?: string
          internal_notes?: string | null
          joined_at?: string | null
          last_confirmation_date?: string | null
          last_name?: string
          mindbody_id?: number
          next_confirmation_due?: string | null
          phone?: string | null
          preferred_time?: string | null
          primary_goal?: string | null
          purchase_type?: string | null
          source?: string | null
          subscription_duration?: string | null
          subscription_end_date?: string | null
          subscription_id?: string | null
          subscription_start_date?: string | null
          subscription_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clients_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      exercises: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          gym_id: string
          id: string
          name: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          gym_id: string
          id?: string
          name: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          gym_id?: string
          id?: string
          name?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "exercises_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exercises_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      gym_registration_codes: {
        Row: {
          active: boolean | null
          code: string
          created_at: string
          created_by: string | null
          expires_at: string | null
          gym_id: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          gym_id: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string
          created_by?: string | null
          expires_at?: string | null
          gym_id?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "gym_registration_codes_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      gym_settings: {
        Row: {
          allow_template_duplication: boolean | null
          created_at: string
          custom_plan_confirmation_days: number | null
          days_to_active_confirmation: number | null
          days_to_first_followup: number | null
          default_trainer_assignment_logic: string | null
          enable_auto_followup: boolean | null
          gym_id: string
          id: string
          max_trials_per_client: number | null
          package_confirmation_days: number | null
          template_sent_by: string | null
          template_viewable_by_client: boolean | null
          updated_at: string
        }
        Insert: {
          allow_template_duplication?: boolean | null
          created_at?: string
          custom_plan_confirmation_days?: number | null
          days_to_active_confirmation?: number | null
          days_to_first_followup?: number | null
          default_trainer_assignment_logic?: string | null
          enable_auto_followup?: boolean | null
          gym_id: string
          id?: string
          max_trials_per_client?: number | null
          package_confirmation_days?: number | null
          template_sent_by?: string | null
          template_viewable_by_client?: boolean | null
          updated_at?: string
        }
        Update: {
          allow_template_duplication?: boolean | null
          created_at?: string
          custom_plan_confirmation_days?: number | null
          days_to_active_confirmation?: number | null
          days_to_first_followup?: number | null
          default_trainer_assignment_logic?: string | null
          enable_auto_followup?: boolean | null
          gym_id?: string
          id?: string
          max_trials_per_client?: number | null
          package_confirmation_days?: number | null
          template_sent_by?: string | null
          template_viewable_by_client?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "gym_settings_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: true
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      gyms: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          postal_code: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      instructor_specialties: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          gym_id: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          gym_id: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          gym_id?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructor_specialties_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      instructor_specialty_links: {
        Row: {
          created_at: string
          id: string
          specialty_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          specialty_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          specialty_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructor_specialty_links_specialty_id_fkey"
            columns: ["specialty_id"]
            isOneToOne: false
            referencedRelation: "instructor_specialties"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instructor_specialty_links_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          notification_type: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          notification_type?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          notification_type?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          auto_renewal: boolean | null
          created_at: string
          description: string | null
          duration_days: number
          gym_id: string
          id: string
          is_active: boolean | null
          name: string
          price: number | null
          updated_at: string
        }
        Insert: {
          auto_renewal?: boolean | null
          created_at?: string
          description?: string | null
          duration_days: number
          gym_id: string
          id?: string
          is_active?: boolean | null
          name: string
          price?: number | null
          updated_at?: string
        }
        Update: {
          auto_renewal?: boolean | null
          created_at?: string
          description?: string | null
          duration_days?: number
          gym_id?: string
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      template_exercises: {
        Row: {
          created_at: string
          exercise_id: string
          id: string
          notes: string | null
          order_index: number
          reps: string
          rest_time: number | null
          sets: number
          template_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          exercise_id: string
          id?: string
          notes?: string | null
          order_index: number
          reps: string
          rest_time?: number | null
          sets: number
          template_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          exercise_id?: string
          id?: string
          notes?: string | null
          order_index?: number
          reps?: string
          rest_time?: number | null
          sets?: number
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "template_exercises_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "exercises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "template_exercises_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "workout_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_contracts: {
        Row: {
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at: string
          end_date: string | null
          file_url: string | null
          gym_id: string
          id: string
          monthly_fee: number | null
          notes: string | null
          percentage: number | null
          start_date: string
          trainer_id: string
          updated_at: string
        }
        Insert: {
          contract_type: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          end_date?: string | null
          file_url?: string | null
          gym_id: string
          id?: string
          monthly_fee?: number | null
          notes?: string | null
          percentage?: number | null
          start_date: string
          trainer_id: string
          updated_at?: string
        }
        Update: {
          contract_type?: Database["public"]["Enums"]["contract_type"]
          created_at?: string
          end_date?: string | null
          file_url?: string | null
          gym_id?: string
          id?: string
          monthly_fee?: number | null
          notes?: string | null
          percentage?: number | null
          start_date?: string
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trainer_contracts_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainer_contracts_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trainer_insurance: {
        Row: {
          created_at: string
          end_date: string
          file_url: string | null
          gym_id: string
          id: string
          notes: string | null
          policy_number: string | null
          start_date: string
          trainer_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          end_date: string
          file_url?: string | null
          gym_id: string
          id?: string
          notes?: string | null
          policy_number?: string | null
          start_date: string
          trainer_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          end_date?: string
          file_url?: string | null
          gym_id?: string
          id?: string
          notes?: string | null
          policy_number?: string | null
          start_date?: string
          trainer_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trainer_insurance_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trainer_insurance_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      trial_questionnaires: {
        Row: {
          client_id: string
          compiled_by_role: Database["public"]["Enums"]["app_role"]
          created_at: string
          custom_reason: string | null
          future_interest: boolean | null
          id: string
          purchased: boolean
          reason_not_purchased: string | null
          trainer_id: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          compiled_by_role: Database["public"]["Enums"]["app_role"]
          created_at?: string
          custom_reason?: string | null
          future_interest?: boolean | null
          id?: string
          purchased: boolean
          reason_not_purchased?: string | null
          trainer_id?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          compiled_by_role?: Database["public"]["Enums"]["app_role"]
          created_at?: string
          custom_reason?: string | null
          future_interest?: boolean | null
          id?: string
          purchased?: boolean
          reason_not_purchased?: string | null
          trainer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trial_questionnaires_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trial_questionnaires_trainer_id_fkey"
            columns: ["trainer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          gym_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          gym_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          gym_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      user_unavailability: {
        Row: {
          created_at: string
          document_url: string | null
          end_date: string
          gym_id: string
          id: string
          notes: string | null
          reason: Database["public"]["Enums"]["unavailability_reason"]
          start_date: string
          updated_at: string
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          document_url?: string | null
          end_date: string
          gym_id: string
          id?: string
          notes?: string | null
          reason: Database["public"]["Enums"]["unavailability_reason"]
          start_date: string
          updated_at?: string
          user_id: string
          user_role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          document_url?: string | null
          end_date?: string
          gym_id?: string
          id?: string
          notes?: string | null
          reason?: Database["public"]["Enums"]["unavailability_reason"]
          start_date?: string
          updated_at?: string
          user_id?: string
          user_role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: [
          {
            foreignKeyName: "user_unavailability_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_unavailability_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          full_name: string
          gym_id: string | null
          id: string
          registration_date: string
          role: Database["public"]["Enums"]["app_role"]
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          gym_id?: string | null
          id: string
          registration_date?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          gym_id?: string | null
          id?: string
          registration_date?: string
          role?: Database["public"]["Enums"]["app_role"]
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
      workout_templates: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          gym_id: string
          id: string
          is_default: boolean | null
          locked: boolean | null
          name: string
          type: Database["public"]["Enums"]["workout_type"] | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          gym_id: string
          id?: string
          is_default?: boolean | null
          locked?: boolean | null
          name: string
          type?: Database["public"]["Enums"]["workout_type"] | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          gym_id?: string
          id?: string
          is_default?: boolean | null
          locked?: boolean | null
          name?: string
          type?: Database["public"]["Enums"]["workout_type"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "workout_templates_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workout_templates_gym_id_fkey"
            columns: ["gym_id"]
            isOneToOne: false
            referencedRelation: "gyms"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      belongs_to_same_gym: {
        Args: { user_id: string; gym_id: string }
        Returns: boolean
      }
      create_notification: {
        Args: {
          p_user_id: string
          p_title: string
          p_message: string
          p_notification_type?: string
        }
        Returns: string
      }
      create_notification_for_role: {
        Args: {
          p_role: string
          p_title: string
          p_message: string
          p_notification_type?: string
        }
        Returns: string
      }
      get_gym_id_from_code: {
        Args: { registration_code: string }
        Returns: string
      }
      get_role_from_code: {
        Args: { registration_code: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      get_user_gym_id: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_operator: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_trainer: {
        Args: { user_id: string }
        Returns: boolean
      }
      mark_all_notifications_read: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      mark_notification_read: {
        Args: { p_notification_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "operator" | "trainer" | "assistant" | "instructor"
      contract_type: "collaboration" | "vat_fixed_fee" | "vat_percentage"
      conversion_status: "converted" | "not_converted" | "undecided" | "pending"
      message_priority: "normal" | "urgent"
      notification_type: "call" | "email" | "in_app" | "whatsapp" | "sms"
      unavailability_reason:
        | "illness"
        | "injury"
        | "vacation"
        | "personal"
        | "other"
      workout_type:
        | "full_body"
        | "upper_body"
        | "lower_body"
        | "push"
        | "pull"
        | "legs"
        | "core"
        | "cardio"
        | "circuit"
        | "arms"
        | "shoulders"
        | "back"
        | "chest"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "operator", "trainer", "assistant", "instructor"],
      contract_type: ["collaboration", "vat_fixed_fee", "vat_percentage"],
      conversion_status: ["converted", "not_converted", "undecided", "pending"],
      message_priority: ["normal", "urgent"],
      notification_type: ["call", "email", "in_app", "whatsapp", "sms"],
      unavailability_reason: [
        "illness",
        "injury",
        "vacation",
        "personal",
        "other",
      ],
      workout_type: [
        "full_body",
        "upper_body",
        "lower_body",
        "push",
        "pull",
        "legs",
        "core",
        "cardio",
        "circuit",
        "arms",
        "shoulders",
        "back",
        "chest",
      ],
    },
  },
} as const
