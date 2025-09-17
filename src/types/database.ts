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
          browser: string | null
          city: string | null
          country: string | null
          created_at: string | null
          custom_parameters: Json | null
          device_type: string | null
          event_action: string | null
          event_category: string | null
          event_label: string | null
          event_name: string
          event_value: number | null
          id: string
          ip_address: unknown | null
          os: string | null
          page_path: string | null
          page_referrer: string | null
          page_title: string | null
          session_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          custom_parameters?: Json | null
          device_type?: string | null
          event_action?: string | null
          event_category?: string | null
          event_label?: string | null
          event_name: string
          event_value?: number | null
          id?: string
          ip_address?: unknown | null
          os?: string | null
          page_path?: string | null
          page_referrer?: string | null
          page_title?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          custom_parameters?: Json | null
          device_type?: string | null
          event_action?: string | null
          event_category?: string | null
          event_label?: string | null
          event_name?: string
          event_value?: number | null
          id?: string
          ip_address?: unknown | null
          os?: string | null
          page_path?: string | null
          page_referrer?: string | null
          page_title?: string | null
          session_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      contacts: {
        Row: {
          company: string | null
          created_at: string | null
          email: string
          id: string
          ip_address: unknown | null
          message: string
          name: string
          referrer: string | null
          source: string | null
          status: string | null
          updated_at: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string | null
          email: string
          id?: string
          ip_address?: unknown | null
          message: string
          name: string
          referrer?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string | null
          email?: string
          id?: string
          ip_address?: unknown | null
          message?: string
          name?: string
          referrer?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
      conversion_events: {
        Row: {
          campaign: string | null
          conversion_value: number | null
          created_at: string | null
          currency: string | null
          custom_parameters: Json | null
          event_name: string
          id: string
          items: Json | null
          medium: string | null
          session_id: string | null
          source: string | null
          transaction_id: string | null
          user_id: string | null
        }
        Insert: {
          campaign?: string | null
          conversion_value?: number | null
          created_at?: string | null
          currency?: string | null
          custom_parameters?: Json | null
          event_name: string
          id?: string
          items?: Json | null
          medium?: string | null
          session_id?: string | null
          source?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Update: {
          campaign?: string | null
          conversion_value?: number | null
          created_at?: string | null
          currency?: string | null
          custom_parameters?: Json | null
          event_name?: string
          id?: string
          items?: Json | null
          medium?: string | null
          session_id?: string | null
          source?: string | null
          transaction_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      form_analytics: {
        Row: {
          completion_rate: number | null
          created_at: string | null
          custom_data: Json | null
          event_type: string
          field_name: string | null
          field_value_length: number | null
          form_id: string
          form_name: string | null
          id: string
          page_path: string | null
          session_id: string | null
          step_number: number | null
          time_spent_seconds: number | null
          total_steps: number | null
        }
        Insert: {
          completion_rate?: number | null
          created_at?: string | null
          custom_data?: Json | null
          event_type: string
          field_name?: string | null
          field_value_length?: number | null
          form_id: string
          form_name?: string | null
          id?: string
          page_path?: string | null
          session_id?: string | null
          step_number?: number | null
          time_spent_seconds?: number | null
          total_steps?: number | null
        }
        Update: {
          completion_rate?: number | null
          created_at?: string | null
          custom_data?: Json | null
          event_type?: string
          field_name?: string | null
          field_value_length?: number | null
          form_id?: string
          form_name?: string | null
          id?: string
          page_path?: string | null
          session_id?: string | null
          step_number?: number | null
          time_spent_seconds?: number | null
          total_steps?: number | null
        }
        Relationships: []
      }
      subscribers: {
        Row: {
          confirmed_at: string | null
          created_at: string | null
          email: string
          id: string
          ip_address: unknown | null
          metadata: Json | null
          referrer: string | null
          source: string | null
          status: string | null
          tags: string[] | null
          unsubscribed_at: string | null
          updated_at: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
        }
        Insert: {
          confirmed_at?: string | null
          created_at?: string | null
          email: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          referrer?: string | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          unsubscribed_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Update: {
          confirmed_at?: string | null
          created_at?: string | null
          email?: string
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          referrer?: string | null
          source?: string | null
          status?: string | null
          tags?: string[] | null
          unsubscribed_at?: string | null
          updated_at?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const