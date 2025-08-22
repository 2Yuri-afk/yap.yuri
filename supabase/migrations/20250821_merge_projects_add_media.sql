-- Merge projects into posts and add media support

-- Add post_type enum
CREATE TYPE post_type AS ENUM ('post', 'project', 'announcement');

-- Add new columns to posts table
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS post_type post_type DEFAULT 'post',
ADD COLUMN IF NOT EXISTS media_attachments jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS project_url text,
ADD COLUMN IF NOT EXISTS github_url text,
ADD COLUMN IF NOT EXISTS tech_stack text[],
ADD COLUMN IF NOT EXISTS featured boolean DEFAULT false;

-- Migrate existing projects to posts
INSERT INTO posts (
  title, 
  slug, 
  excerpt,
  content,
  cover_image,
  status,
  published_at,
  created_at,
  updated_at,
  author_id,
  post_type,
  project_url,
  github_url,
  tech_stack,
  featured
)
SELECT 
  title,
  slug,
  description as excerpt,
  content,
  cover_image,
  status,
  published_at,
  created_at,
  updated_at,
  author_id,
  'project'::post_type,
  project_url,
  github_url,
  tech_stack,
  featured
FROM projects
WHERE NOT EXISTS (
  SELECT 1 FROM posts WHERE posts.slug = projects.slug
);

-- Drop old project-related tables
DROP TABLE IF EXISTS project_tags;
DROP TABLE IF EXISTS projects;

-- Create media table for storing attachment metadata
CREATE TABLE IF NOT EXISTS media (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  url text NOT NULL,
  type text NOT NULL, -- 'image', 'video', 'document'
  filename text,
  size integer,
  width integer,
  height integer,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on media
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Media policies
CREATE POLICY "Anyone can view media on published posts" ON media FOR SELECT
USING (EXISTS (
  SELECT 1 FROM posts 
  WHERE posts.id = media.post_id 
  AND posts.status = 'published' 
  AND coalesce(posts.published_at, now()) <= now()
));

CREATE POLICY "Author can manage media" ON media FOR ALL
USING (EXISTS (
  SELECT 1 FROM posts 
  WHERE posts.id = media.post_id 
  AND posts.author_id = auth.uid()
));
