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
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          role: 'user' | 'admin'
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          role?: 'user' | 'admin'
          created_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          slug: string
          title: string
          description: string | null
          price_cents: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          title: string
          description?: string | null
          price_cents: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          title?: string
          description?: string | null
          price_cents?: number
          created_at?: string
        }
      }
      modules: {
        Row: {
          id: string
          course_id: string
          title: string
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          order: number
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          order?: number
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          module_id: string
          slug: string
          title: string
          order: number
          video_provider: 'youtube' | 'vimeo' | 'bunny'
          video_url: string
          duration_sec: number | null
          created_at: string
        }
        Insert: {
          id?: string
          module_id: string
          slug: string
          title: string
          order: number
          video_provider: 'youtube' | 'vimeo' | 'bunny'
          video_url: string
          duration_sec?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          module_id?: string
          slug?: string
          title?: string
          order?: number
          video_provider?: 'youtube' | 'vimeo' | 'bunny'
          video_url?: string
          duration_sec?: number | null
          created_at?: string
        }
      }
      entitlements: {
        Row: {
          id: string
          user_id: string
          course_id: string
          status: 'active' | 'inactive'
          activated_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          status?: 'active' | 'inactive'
          activated_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          status?: 'active' | 'inactive'
          activated_at?: string | null
          expires_at?: string | null
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          asaas_payment_id: string
          asaas_customer_id: string | null
          status: string
          value_cents: number
          billing_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          asaas_payment_id: string
          asaas_customer_id?: string | null
          status: string
          value_cents: number
          billing_type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          asaas_payment_id?: string
          asaas_customer_id?: string | null
          status?: string
          value_cents?: number
          billing_type?: string
          created_at?: string
          updated_at?: string
        }
      }
      lesson_progress: {
        Row: {
          id: string
          user_id: string
          lesson_id: string
          watched_seconds: number
          completed: boolean
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lesson_id: string
          watched_seconds?: number
          completed?: boolean
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          lesson_id?: string
          watched_seconds?: number
          completed?: boolean
          updated_at?: string
        }
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
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']
export type Insertable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert']
export type Updatable<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update']
