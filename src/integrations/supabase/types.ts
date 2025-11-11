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
      buses: {
        Row: {
          bus_id: string
          created_at: string
          current_speed: number | null
          driver_name: string | null
          id: string
          qr_code_url: string | null
          route_number: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          bus_id: string
          created_at?: string
          current_speed?: number | null
          driver_name?: string | null
          id?: string
          qr_code_url?: string | null
          route_number?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          bus_id?: string
          created_at?: string
          current_speed?: number | null
          driver_name?: string | null
          id?: string
          qr_code_url?: string | null
          route_number?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          bus_id: string
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
        }
        Insert: {
          bus_id: string
          category: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
        }
        Update: {
          bus_id?: string
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "buses"
            referencedColumns: ["bus_id"]
          },
        ]
      }
      incidents: {
        Row: {
          bus_id: string
          category: string
          created_at: string
          description: string
          id: string
          image_url: string | null
        }
        Insert: {
          bus_id: string
          category: string
          created_at?: string
          description: string
          id?: string
          image_url?: string | null
        }
        Update: {
          bus_id?: string
          category?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "incidents_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "buses"
            referencedColumns: ["bus_id"]
          },
        ]
      }
      route_stops: {
        Row: {
          bus_id: string
          created_at: string
          description: string | null
          duration_minutes: number
          id: string
          stop_name: string
          stop_order: number
        }
        Insert: {
          bus_id: string
          created_at?: string
          description?: string | null
          duration_minutes: number
          id?: string
          stop_name: string
          stop_order: number
        }
        Update: {
          bus_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          id?: string
          stop_name?: string
          stop_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "route_stops_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "buses"
            referencedColumns: ["bus_id"]
          },
        ]
      }
      safety_records: {
        Row: {
          bus_id: string
          created_at: string
          date: string
          description: string
          id: string
          rating: number | null
          severity: string | null
          type: string
        }
        Insert: {
          bus_id: string
          created_at?: string
          date: string
          description: string
          id?: string
          rating?: number | null
          severity?: string | null
          type: string
        }
        Update: {
          bus_id?: string
          created_at?: string
          date?: string
          description?: string
          id?: string
          rating?: number | null
          severity?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_records_bus_id_fkey"
            columns: ["bus_id"]
            isOneToOne: false
            referencedRelation: "buses"
            referencedColumns: ["bus_id"]
          },
        ]
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
