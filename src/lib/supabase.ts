import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Accept-Charset': 'utf-8'
    }
  },
  db: {
    schema: 'public'
  }
});

export type Database = {
  public: {
    Tables: {
      prompts: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          content: string;
          category: string;
          usage_hours: number;
          is_favorite: boolean;
          tags: string[];
          user_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          content: string;
          category: string;
          usage_hours?: number;
          is_favorite?: boolean;
          tags?: string[];
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          content?: string;
          category?: string;
          usage_hours?: number;
          is_favorite?: boolean;
          tags?: string[];
          user_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          label: string;
          color: string;
          bg_color: string;
          border_color: string;
          is_default: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          label: string;
          color: string;
          bg_color: string;
          border_color: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          color?: string;
          bg_color?: string;
          border_color?: string;
          is_default?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};