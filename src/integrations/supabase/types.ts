export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      analytics_events: {
        Row: {
          action_type: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          metadata: Json | null
          organization_id: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          action_type?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          metadata?: Json | null
          organization_id: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          action_type?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          metadata?: Json | null
          organization_id?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "analytics_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "user_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          created_at: string | null
          date: string
          id: string
          medecin_id: string
          notes: string | null
          organization_id: string
          patient_id: string
          status: Database["public"]["Enums"]["appointment_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          medecin_id: string
          notes?: string | null
          organization_id: string
          patient_id: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          medecin_id?: string
          notes?: string | null
          organization_id?: string
          patient_id?: string
          status?: Database["public"]["Enums"]["appointment_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          session_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          session_id: string
        }
        Update: {
          created_at?: string
          id?: string
          session_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_rate_limits: {
        Row: {
          last_request: string | null
          request_count: number | null
          session_id: string
          window_start: string | null
        }
        Insert: {
          last_request?: string | null
          request_count?: number | null
          session_id: string
          window_start?: string | null
        }
        Update: {
          last_request?: string | null
          request_count?: number | null
          session_id?: string
          window_start?: string | null
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      email_verification_codes: {
        Row: {
          attempts: number
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          verified: boolean
        }
        Insert: {
          attempts?: number
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          verified?: boolean
        }
        Update: {
          attempts?: number
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          verified?: boolean
        }
        Relationships: []
      }
      form_rate_limits: {
        Row: {
          created_at: string | null
          endpoint: string
          id: string
          ip_address: string
        }
        Insert: {
          created_at?: string | null
          endpoint: string
          id?: string
          ip_address: string
        }
        Update: {
          created_at?: string | null
          endpoint?: string
          id?: string
          ip_address?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          email: string
          id: string
          is_active: boolean | null
          name: string | null
          preferences: Json | null
          subscribed_at: string
        }
        Insert: {
          email: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          preferences?: Json | null
          subscribed_at?: string
        }
        Update: {
          email?: string
          id?: string
          is_active?: boolean | null
          name?: string | null
          preferences?: Json | null
          subscribed_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string
          organization_id: string
          read: boolean
          title: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message: string
          organization_id: string
          read?: boolean
          title: string
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string
          organization_id?: string
          read?: boolean
          title?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          created_by: string | null
          date: string | null
          id: string
          items_count: number
          notes: string | null
          order_number: string
          organization_id: string
          status: string
          supplier: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          id?: string
          items_count?: number
          notes?: string | null
          order_number: string
          organization_id: string
          status?: string
          supplier: string
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date?: string | null
          id?: string
          items_count?: number
          notes?: string | null
          order_number?: string
          organization_id?: string
          status?: string
          supplier?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      organizations: {
        Row: {
          address: string | null
          category: Database["public"]["Enums"]["organization_category"] | null
          cover_url: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          id: string
          logo_url: string | null
          name: string
          organization_code: string
          phone: string | null
          type: Database["public"]["Enums"]["organization_type"]
        }
        Insert: {
          address?: string | null
          category?: Database["public"]["Enums"]["organization_category"] | null
          cover_url?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name: string
          organization_code: string
          phone?: string | null
          type: Database["public"]["Enums"]["organization_type"]
        }
        Update: {
          address?: string | null
          category?: Database["public"]["Enums"]["organization_category"] | null
          cover_url?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          organization_code?: string
          phone?: string | null
          type?: Database["public"]["Enums"]["organization_type"]
        }
        Relationships: []
      }
      patients: {
        Row: {
          age: number | null
          antecedents: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          full_name: string
          gender: Database["public"]["Enums"]["gender_type"] | null
          id: string
          medecin_id: string | null
          organization_id: string
          phone: string | null
          traitement: string | null
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          antecedents?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          full_name: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          medecin_id?: string | null
          organization_id: string
          phone?: string | null
          traitement?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          antecedents?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          full_name?: string
          gender?: Database["public"]["Enums"]["gender_type"] | null
          id?: string
          medecin_id?: string | null
          organization_id?: string
          phone?: string | null
          traitement?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          organization_id: string
          paid_at: string | null
          payment_method: string | null
          paystack_reference: string | null
          paystack_transaction_id: string | null
          status: string
          subscription_id: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          organization_id: string
          paid_at?: string | null
          payment_method?: string | null
          paystack_reference?: string | null
          paystack_transaction_id?: string | null
          status?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          organization_id?: string
          paid_at?: string | null
          payment_method?: string | null
          paystack_reference?: string | null
          paystack_transaction_id?: string | null
          status?: string
          subscription_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_intentions: {
        Row: {
          created_at: string
          email: string | null
          id: string
          intention: string
          is_anonymous: boolean | null
          name: string
          status: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          intention: string
          is_anonymous?: boolean | null
          name: string
          status?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          intention?: string
          is_anonymous?: boolean | null
          name?: string
          status?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          access_code: string | null
          address: string | null
          avatar_url: string | null
          created_at: string | null
          description: string | null
          email: string
          full_name: string
          id: string
          organization_id: string | null
          phone: string | null
          photo_url: string | null
          service: string | null
          updated_at: string | null
        }
        Insert: {
          access_code?: string | null
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          email: string
          full_name: string
          id: string
          organization_id?: string | null
          phone?: string | null
          photo_url?: string | null
          service?: string | null
          updated_at?: string | null
        }
        Update: {
          access_code?: string | null
          address?: string | null
          avatar_url?: string | null
          created_at?: string | null
          description?: string | null
          email?: string
          full_name?: string
          id?: string
          organization_id?: string | null
          phone?: string | null
          photo_url?: string | null
          service?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      programs: {
        Row: {
          created_at: string
          date: string
          description: string
          event_type: string
          id: string
          image_url: string | null
          is_featured: boolean | null
          location: string | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description: string
          event_type?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string
          event_type?: string
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          location?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_name: string | null
          date: string | null
          id: string
          items_count: number
          notes: string | null
          organization_id: string
          payment_method: string
          sale_number: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_name?: string | null
          date?: string | null
          id?: string
          items_count?: number
          notes?: string | null
          organization_id: string
          payment_method: string
          sale_number: string
          total_amount?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_name?: string | null
          date?: string | null
          id?: string
          items_count?: number
          notes?: string | null
          organization_id?: string
          payment_method?: string
          sale_number?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      staff_logs: {
        Row: {
          action: string
          created_at: string | null
          details: Json | null
          id: string
          organization_id: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          details?: Json | null
          id?: string
          organization_id: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          organization_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "staff_logs_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      stock: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          min_quantity: number
          name: string
          organization_id: string
          quantity: number
          reference: string
          supplier: string | null
          unit_price: number
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          min_quantity?: number
          name: string
          organization_id: string
          quantity?: number
          reference: string
          supplier?: string | null
          unit_price: number
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          min_quantity?: number
          name?: string
          organization_id?: string
          quantity?: number
          reference?: string
          supplier?: string | null
          unit_price?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string
          currency: string
          duration_days: number
          features: Json
          id: string
          is_active: boolean
          max_patients: number | null
          max_users: number | null
          name: string
          price: number
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency?: string
          duration_days: number
          features?: Json
          id?: string
          is_active?: boolean
          max_patients?: number | null
          max_users?: number | null
          name: string
          price: number
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency?: string
          duration_days?: number
          features?: Json
          id?: string
          is_active?: boolean
          max_patients?: number | null
          max_users?: number | null
          name?: string
          price?: number
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          end_date: string | null
          id: string
          organization_id: string
          paystack_customer_id: string | null
          paystack_subscription_code: string | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          start_date: string | null
          status: Database["public"]["Enums"]["subscription_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          organization_id: string
          paystack_customer_id?: string | null
          paystack_subscription_code?: string | null
          plan: Database["public"]["Enums"]["subscription_plan"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          end_date?: string | null
          id?: string
          organization_id?: string
          paystack_customer_id?: string | null
          paystack_subscription_code?: string | null
          plan?: Database["public"]["Enums"]["subscription_plan"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["subscription_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          audio_url: string | null
          created_at: string
          email: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          name: string
          phone: string | null
          published_at: string | null
          role: string | null
          testimony: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          name: string
          phone?: string | null
          published_at?: string | null
          role?: string | null
          testimony: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          name?: string
          phone?: string | null
          published_at?: string | null
          role?: string | null
          testimony?: string
          video_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          actions_count: number | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          ip_address: string | null
          organization_id: string
          session_end: string | null
          session_start: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          actions_count?: number | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          ip_address?: string | null
          organization_id: string
          session_end?: string | null
          session_start?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          actions_count?: number | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          ip_address?: string | null
          organization_id?: string
          session_end?: string | null
          session_start?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_sessions_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      profiles_with_roles: {
        Row: {
          access_code: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          organization_category:
            | Database["public"]["Enums"]["organization_category"]
            | null
          organization_id: string | null
          organization_name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["app_role"] | null
          service: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      cleanup_expired_verification_codes: { Args: never; Returns: undefined }
      create_notification_for_org: {
        Args: {
          p_link?: string
          p_message: string
          p_organization_id: string
          p_title: string
          p_type?: string
        }
        Returns: undefined
      }
      create_notification_for_user: {
        Args: {
          p_link?: string
          p_message: string
          p_organization_id: string
          p_title: string
          p_type?: string
          p_user_id: string
        }
        Returns: undefined
      }
      generate_member_access_code: {
        Args: { _organization_id: string; _role: string }
        Returns: string
      }
      generate_organization_code: { Args: never; Returns: string }
      get_user_organization_id: { Args: { _user_id: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_organization_owner: { Args: { _user_id: string }; Returns: boolean }
      is_user_admin: { Args: { _user_id: string }; Returns: boolean }
      same_organization: {
        Args: { _user_id1: string; _user_id2: string }
        Returns: boolean
      }
      user_has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "admin"
        | "directeur_medical"
        | "chef_service"
        | "medecin_specialiste"
        | "medecin_generaliste"
        | "infirmier"
        | "aide_soignant"
        | "sage_femme"
        | "kinesitherapeute"
        | "laborantin"
        | "radiologue"
        | "anesthesiste"
        | "chirurgien"
        | "urgentiste"
        | "cardiologue"
        | "neurologue"
        | "pediatre"
        | "gynecologueobstetricien"
        | "ophtalmologue"
        | "dermatologue"
        | "pharmacien_hospitalier"
        | "technicien_laboratoire"
        | "technicien_radiologie"
        | "brancardier"
        | "agent_entretien"
        | "receptionniste"
        | "secretaire_medical"
        | "gestionnaire_stock"
        | "responsable_logistique"
        | "directeur_pharmacie"
        | "pharmacien"
        | "pharmacien_adjoint"
        | "preparateur_pharmacie"
        | "technicien_pharmacie"
        | "assistant_pharmacie"
        | "caissier_pharmacie"
        | "responsable_stock_pharmacie"
        | "livreur_pharmacie"
        | "vendeur_pharmacie"
        | "stagiaire_pharmacie"
        | "user"
        | "moderator"
        | "patient"
        | "client"
      appointment_status: "planifie" | "en_cours" | "termine" | "annule"
      gender_type: "Homme" | "Femme" | "Autre"
      organization_category:
        | "hopital"
        | "clinique"
        | "pharmacie"
        | "particulier"
      organization_type: "hopital_public" | "clinique_privee" | "centre_sante"
      subscription_plan: "basic" | "pro" | "clinic"
      subscription_status: "actif" | "expire" | "suspendu"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "admin",
        "directeur_medical",
        "chef_service",
        "medecin_specialiste",
        "medecin_generaliste",
        "infirmier",
        "aide_soignant",
        "sage_femme",
        "kinesitherapeute",
        "laborantin",
        "radiologue",
        "anesthesiste",
        "chirurgien",
        "urgentiste",
        "cardiologue",
        "neurologue",
        "pediatre",
        "gynecologueobstetricien",
        "ophtalmologue",
        "dermatologue",
        "pharmacien_hospitalier",
        "technicien_laboratoire",
        "technicien_radiologie",
        "brancardier",
        "agent_entretien",
        "receptionniste",
        "secretaire_medical",
        "gestionnaire_stock",
        "responsable_logistique",
        "directeur_pharmacie",
        "pharmacien",
        "pharmacien_adjoint",
        "preparateur_pharmacie",
        "technicien_pharmacie",
        "assistant_pharmacie",
        "caissier_pharmacie",
        "responsable_stock_pharmacie",
        "livreur_pharmacie",
        "vendeur_pharmacie",
        "stagiaire_pharmacie",
        "user",
        "moderator",
        "patient",
        "client",
      ],
      appointment_status: ["planifie", "en_cours", "termine", "annule"],
      gender_type: ["Homme", "Femme", "Autre"],
      organization_category: [
        "hopital",
        "clinique",
        "pharmacie",
        "particulier",
      ],
      organization_type: ["hopital_public", "clinique_privee", "centre_sante"],
      subscription_plan: ["basic", "pro", "clinic"],
      subscription_status: ["actif", "expire", "suspendu"],
    },
  },
} as const
