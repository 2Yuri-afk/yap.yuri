-- Create site_settings table for dynamic content
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated users can manage settings" ON site_settings;

-- Policies: Anyone can read, only authenticated users can modify
CREATE POLICY "Anyone can view site settings" ON site_settings 
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage settings" ON site_settings 
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES 
  ('currently', jsonb_build_object(
    'learning', 'Rust & WebAssembly',
    'building', '8-bit portfolio site',
    'reading', 'Clean Architecture',
    'last_commit', '2 hours ago'
  )),
  ('status', jsonb_build_object(
    'mood', 'caffeinated ☕',
    'listening', 'lo-fi beats 🎵',
    'quote', 'Code is like humor. When you have to explain it, it''s bad.',
    'quote_author', 'Cory House'
  ))
ON CONFLICT (key) DO NOTHING;
