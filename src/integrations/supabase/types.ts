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
      articles: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          likes: number | null
          published_at: string | null
          status: Database["public"]["Enums"]["content_status"] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          likes?: number | null
          published_at?: string | null
          status?: Database["public"]["Enums"]["content_status"] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "articles_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          booking_date: string
          booking_time: string
          client_id: string | null
          consultant_id: string | null
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          notes: string | null
          price: number | null
          service_type: string
          status: Database["public"]["Enums"]["booking_status"] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          booking_date: string
          booking_time: string
          client_id?: string | null
          consultant_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          notes?: string | null
          price?: number | null
          service_type: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          booking_date?: string
          booking_time?: string
          client_id?: string | null
          consultant_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          notes?: string | null
          price?: number | null
          service_type?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_consultant_id_fkey"
            columns: ["consultant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cart_items: {
        Row: {
          created_at: string
          currency: string | null
          id: string
          product_id: string | null
          quantity: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          currency?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          currency?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      case_studies: {
        Row: {
          author_id: string | null
          category: string
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          published_at: string | null
          region: string
          success_metrics: Json | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          region: string
          success_metrics?: Json | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          published_at?: string | null
          region?: string
          success_metrics?: Json | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "case_studies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          description_ar: string | null
          id: string
          image_url: string | null
          name: string
          name_ar: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          id?: string
          image_url?: string | null
          name: string
          name_ar: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          description_ar?: string | null
          id?: string
          image_url?: string | null
          name?: string
          name_ar?: string
          updated_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          parent_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          parent_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_stats: {
        Row: {
          id: string
          last_updated: string | null
          metric_name: string
          metric_value: number | null
          percentage_change: number | null
          previous_value: number | null
        }
        Insert: {
          id?: string
          last_updated?: string | null
          metric_name: string
          metric_value?: number | null
          percentage_change?: number | null
          previous_value?: number | null
        }
        Update: {
          id?: string
          last_updated?: string | null
          metric_name?: string
          metric_value?: number | null
          percentage_change?: number | null
          previous_value?: number | null
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          preferences: Json | null
          subscribed: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          preferences?: Json | null
          subscribed?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          preferences?: Json | null
          subscribed?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          currency: string | null
          id: string
          order_id: string | null
          price: number
          product_id: string | null
          quantity: number
        }
        Insert: {
          created_at?: string
          currency?: string | null
          id?: string
          order_id?: string | null
          price: number
          product_id?: string | null
          quantity: number
        }
        Update: {
          created_at?: string
          currency?: string | null
          id?: string
          order_id?: string | null
          price?: number
          product_id?: string | null
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          admin_notes: string | null
          created_at: string
          currency: string | null
          estimated_delivery_date: string | null
          id: string
          notes: string | null
          payment_method: string | null
          payment_status: string | null
          phone: string
          shipping_address: string
          status: Database["public"]["Enums"]["order_status_enum"]
          stripe_session_id: string | null
          total_amount: number
          tracking_number: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          created_at?: string
          currency?: string | null
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          phone: string
          shipping_address: string
          status?: Database["public"]["Enums"]["order_status_enum"]
          stripe_session_id?: string | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          created_at?: string
          currency?: string | null
          estimated_delivery_date?: string | null
          id?: string
          notes?: string | null
          payment_method?: string | null
          payment_status?: string | null
          phone?: string
          shipping_address?: string
          status?: Database["public"]["Enums"]["order_status_enum"]
          stripe_session_id?: string | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          created_at: string
          currency: string | null
          description: string | null
          description_ar: string | null
          id: string
          images: string[] | null
          is_active: boolean | null
          name: string
          name_ar: string
          price: number
          seller_id: string | null
          stock_quantity: number
          unit: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          description_ar?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          name: string
          name_ar: string
          price: number
          seller_id?: string | null
          stock_quantity?: number
          unit?: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          currency?: string | null
          description?: string | null
          description_ar?: string | null
          id?: string
          images?: string[] | null
          is_active?: boolean | null
          name?: string
          name_ar?: string
          price?: number
          seller_id?: string | null
          stock_quantity?: number
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string | null
          field_visit_price: number | null
          first_name: string | null
          id: string
          is_active: boolean | null
          last_name: string | null
          newsletter_subscribed: boolean | null
          permissions: Json | null
          phone_price: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
          video_price: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          field_visit_price?: number | null
          first_name?: string | null
          id: string
          is_active?: boolean | null
          last_name?: string | null
          newsletter_subscribed?: boolean | null
          permissions?: Json | null
          phone_price?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          video_price?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string | null
          field_visit_price?: number | null
          first_name?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string | null
          newsletter_subscribed?: boolean | null
          permissions?: Json | null
          phone_price?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
          video_price?: number | null
        }
        Relationships: []
      }
      recent_activities: {
        Row: {
          activity_type: string
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          title: string
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          title: string
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recent_activities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          author_id: string | null
          category: string
          created_at: string | null
          description: string | null
          duration: number | null
          id: string
          likes: number | null
          published_at: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string
          views: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          likes?: number | null
          published_at?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url: string
          views?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          duration?: number | null
          id?: string
          likes?: number | null
          published_at?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_article: {
        Args: {
          article_title: string
          article_content: string
          article_category: string
          article_excerpt?: string
          article_image_url?: string
          article_tags?: string[]
        }
        Returns: string
      }
      create_case_study: {
        Args: {
          study_title: string
          study_content: string
          study_category: string
          study_region: string
          study_summary?: string
          study_image_url?: string
          study_tags?: string[]
          study_success_metrics?: Json
        }
        Returns: string
      }
      create_first_admin: {
        Args: { target_email: string }
        Returns: string
      }
      create_video: {
        Args: {
          video_title: string
          video_description: string
          video_url: string
          video_category: string
          video_thumbnail_url?: string
          video_tags?: string[]
          video_duration?: number
        }
        Returns: string
      }
      delete_article: {
        Args: { article_id: string }
        Returns: boolean
      }
      get_admin_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_orders: number
          pending_orders: number
          total_revenue: number
          total_users: number
          total_products: number
        }[]
      }
      get_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          metric_name: string
          metric_value: number
          previous_value: number
          percentage_change: number
        }[]
      }
      get_recent_activities: {
        Args: { limit_count?: number }
        Returns: {
          id: string
          user_id: string
          activity_type: string
          title: string
          description: string
          created_at: string
          user_name: string
        }[]
      }
      get_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      make_user_admin: {
        Args: { target_user_id: string }
        Returns: string
      }
      update_article: {
        Args: {
          article_id: string
          article_title: string
          article_content: string
          article_category: string
          article_status?: string
          article_excerpt?: string
          article_image_url?: string
          article_tags?: string[]
        }
        Returns: boolean
      }
      update_booking_status: {
        Args: { booking_id: string; new_status: string }
        Returns: boolean
      }
      update_dashboard_stats: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_order_status: {
        Args: {
          order_id: string
          new_status: string
          admin_notes?: string
          tracking_number?: string
          estimated_delivery?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      content_status: "draft" | "published" | "archived"
      order_status_enum:
        | "pending"
        | "confirmed"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded"
      user_role: "user" | "admin" | "moderator"
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
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      content_status: ["draft", "published", "archived"],
      order_status_enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
      ],
      user_role: ["user", "admin", "moderator"],
    },
  },
} as const
