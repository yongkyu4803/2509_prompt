-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL,
  bg_color TEXT NOT NULL,
  border_color TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Insert default categories
INSERT INTO categories (label, color, bg_color, border_color, is_default) VALUES
  ('개발', 'text-purple-700', 'bg-purple-100', 'border-purple-200', TRUE),
  ('마케팅', 'text-blue-700', 'bg-blue-100', 'border-blue-200', TRUE),
  ('분석', 'text-green-700', 'bg-green-100', 'border-green-200', TRUE),
  ('창작', 'text-yellow-700', 'bg-yellow-100', 'border-yellow-200', TRUE),
  ('비즈니스', 'text-red-700', 'bg-red-100', 'border-red-200', TRUE);

-- Update prompts table to use text category instead of enum
ALTER TABLE prompts ALTER COLUMN category TYPE TEXT;

-- Create RLS policies for categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Allow all users to read categories
CREATE POLICY "Categories are readable by all users" ON categories
  FOR SELECT USING (true);

-- Only authenticated users can modify categories (can be further restricted to admin users)
CREATE POLICY "Categories are modifiable by authenticated users" ON categories
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();