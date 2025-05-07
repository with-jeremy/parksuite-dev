export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      amenities: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      availability: {
        Row: {
          created_at: string | null;
          date: string;
          id: string;
          is_available: boolean | null;
          notes: string | null;
          parking_spot_id: string | null;
          price_override: number | null;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          id?: string;
          is_available?: boolean | null;
          notes?: string | null;
          parking_spot_id?: string | null;
          price_override?: number | null;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          id?: string;
          is_available?: boolean | null;
          notes?: string | null;
          parking_spot_id?: string | null;
          price_override?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "availability_parking_spot_id_fkey";
            columns: ["parking_spot_id"];
            isOneToOne: false;
            referencedRelation: "parking_spots";
            referencedColumns: ["id"];
          }
        ];
      };
      bookings: {
        Row: {
          booking_date: string;
          check_in_time: string | null;
          check_out_time: string | null;
          created_at: string | null;
          has_review: boolean | null;
          id: string;
          parking_spot_id: string | null;
          price_per_day: number;
          service_fee: number;
          status: string;
          total_price: number;
          user_id: string | null;
        };
        Insert: {
          booking_date: string;
          check_in_time?: string | null;
          check_out_time?: string | null;
          created_at?: string | null;
          has_review?: boolean | null;
          id?: string;
          parking_spot_id?: string | null;
          price_per_day: number;
          service_fee: number;
          status: string;
          total_price: number;
          user_id?: string | null;
        };
        Update: {
          booking_date?: string;
          check_in_time?: string | null;
          check_out_time?: string | null;
          created_at?: string | null;
          has_review?: boolean | null;
          id?: string;
          parking_spot_id?: string | null;
          price_per_day?: number;
          service_fee?: number;
          status?: string;
          total_price?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bookings_parking_spot_id_fkey";
            columns: ["parking_spot_id"];
            isOneToOne: false;
            referencedRelation: "parking_spots";
            referencedColumns: ["id"];
          }
        ];
      };
      earnings_payments: {
        Row: {
          amount: number;
          booking_id: string | null;
          created_at: string | null;
          id: number;
          status: string;
          user_id: string;
        };
        Insert: {
          amount: number;
          booking_id?: string | null;
          created_at?: string | null;
          id?: never;
          status?: string;
          user_id: string;
        };
        Update: {
          amount?: number;
          booking_id?: string | null;
          created_at?: string | null;
          id?: never;
          status?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "earnings_payments_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          }
        ];
      };
      event_types: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          created_at: string | null;
          date: string;
          description: string | null;
          end_time: string;
          event_type_id: string | null;
          id: string;
          image_url: string | null;
          is_active: boolean | null;
          name: string;
          start_time: string;
          venue_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          date: string;
          description?: string | null;
          end_time: string;
          event_type_id?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean | null;
          name: string;
          start_time: string;
          venue_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          date?: string;
          description?: string | null;
          end_time?: string;
          event_type_id?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean | null;
          name?: string;
          start_time?: string;
          venue_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "events_event_type_id_fkey";
            columns: ["event_type_id"];
            isOneToOne: false;
            referencedRelation: "event_types";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_venue_id_fkey";
            columns: ["venue_id"];
            isOneToOne: false;
            referencedRelation: "venues";
            referencedColumns: ["id"];
          }
        ];
      };
      parking_spot_amenities: {
        Row: {
          amenity_id: string | null;
          created_at: string | null;
          id: string;
          parking_spot_id: string | null;
        };
        Insert: {
          amenity_id?: string | null;
          created_at?: string | null;
          id?: string;
          parking_spot_id?: string | null;
        };
        Update: {
          amenity_id?: string | null;
          created_at?: string | null;
          id?: string;
          parking_spot_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "parking_spot_amenities_amenity_id_fkey";
            columns: ["amenity_id"];
            isOneToOne: false;
            referencedRelation: "amenities";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "parking_spot_amenities_parking_spot_id_fkey";
            columns: ["parking_spot_id"];
            isOneToOne: false;
            referencedRelation: "parking_spots";
            referencedColumns: ["id"];
          }
        ];
      };
      parking_spot_images: {
        Row: {
          created_at: string | null;
          id: string;
          image_url: string;
          is_primary: boolean | null;
          parking_spot_id: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          image_url: string;
          is_primary?: boolean | null;
          parking_spot_id?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          image_url?: string;
          is_primary?: boolean | null;
          parking_spot_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "parking_spot_images_parking_spot_id_fkey";
            columns: ["parking_spot_id"];
            isOneToOne: false;
            referencedRelation: "parking_spots";
            referencedColumns: ["id"];
          }
        ];
      };
      parking_spots: {
        Row: {
          address: string;
          city: string;
          created_at: string | null;
          description: string | null;
          id: string;
          instructions: string | null;
          is_active: boolean | null;
          lat: string | null;
          lng: string | null;
          owner_id: string | null;
          price_per_day: number;
          spaces_available: number | null;
          state: string;
          title: string;
          type: string;
          zip_code: string;
        };
        Insert: {
          address: string;
          city: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          instructions?: string | null;
          is_active?: boolean | null;
          lat?: string | null;
          lng?: string | null;
          owner_id?: string | null;
          price_per_day: number;
          spaces_available?: number | null;
          state: string;
          title: string;
          type: string;
          zip_code: string;
        };
        Update: {
          address?: string;
          city?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          instructions?: string | null;
          is_active?: boolean | null;
          lat?: string | null;
          lng?: string | null;
          owner_id?: string | null;
          price_per_day?: number;
          spaces_available?: number | null;
          state?: string;
          title?: string;
          type?: string;
          zip_code?: string;
        };
        Relationships: [];
      };
      reviews: {
        Row: {
          booking_id: string | null;
          comment: string | null;
          created_at: string | null;
          id: string;
          rating: number;
          user_id: string | null;
        };
        Insert: {
          booking_id?: string | null;
          comment?: string | null;
          created_at?: string | null;
          id?: string;
          rating: number;
          user_id?: string | null;
        };
        Update: {
          booking_id?: string | null;
          comment?: string | null;
          created_at?: string | null;
          id?: string;
          rating?: number;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey";
            columns: ["booking_id"];
            isOneToOne: false;
            referencedRelation: "bookings";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          avatar_url: string | null;
          bio: string | null;
          created_at: string | null;
          email: string;
          first_name: string | null;
          id: string;
          is_admin: boolean | null;
          is_host: boolean | null;
          last_name: string | null;
          phone: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          email: string;
          first_name?: string | null;
          id?: string;
          is_admin?: boolean | null;
          is_host?: boolean | null;
          last_name?: string | null;
          phone?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          email?: string;
          first_name?: string | null;
          id?: string;
          is_admin?: boolean | null;
          is_host?: boolean | null;
          last_name?: string | null;
          phone?: string | null;
        };
        Relationships: [];
      };
      venue_types: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      venues: {
        Row: {
          address: string;
          capacity: number | null;
          city: string;
          created_at: string | null;
          description: string | null;
          id: string;
          image_url: string | null;
          is_active: boolean | null;
          name: string;
          state: string;
          venue_type_id: string | null;
          zip_code: string;
        };
        Insert: {
          address: string;
          capacity?: number | null;
          city: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean | null;
          name: string;
          state: string;
          venue_type_id?: string | null;
          zip_code: string;
        };
        Update: {
          address?: string;
          capacity?: number | null;
          city?: string;
          created_at?: string | null;
          description?: string | null;
          id?: string;
          image_url?: string | null;
          is_active?: boolean | null;
          name?: string;
          state?: string;
          venue_type_id?: string | null;
          zip_code?: string;
        };
        Relationships: [
          {
            foreignKeyName: "venues_venue_type_id_fkey";
            columns: ["venue_type_id"];
            isOneToOne: false;
            referencedRelation: "venue_types";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      booking_status: "pending" | "confirmed" | "cancelled" | "completed";
      notification_type:
        | "booking_request"
        | "booking_confirmed"
        | "booking_cancelled"
        | "payment_received"
        | "review_received"
        | "system";
      parking_type: "driveway" | "garage" | "lot" | "street";
      payment_status: "pending" | "completed" | "failed" | "refunded";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DefaultSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
      DefaultSchema["Views"])
  ? (DefaultSchema["Tables"] &
      DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
  ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
  ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
  ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      notification_type: [
        "booking_request",
        "booking_confirmed",
        "booking_cancelled",
        "payment_received",
        "review_received",
        "system",
      ],
      parking_type: ["driveway", "garage", "lot", "street"],
      payment_status: ["pending", "completed", "failed", "refunded"],
    },
  },
} as const;
