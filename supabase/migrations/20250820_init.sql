-- SQL migration for 8-Bit Personal Blog schema
-- Generated from PRD

-- Extensions
create extension if not exists "pgcrypto";

-- Enums
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status') THEN
    CREATE TYPE content_status AS ENUM ('draft','published','scheduled');
  END IF;
END$$;

-- Profiles (linked to Supabase auth.users)
create table if not exists profiles (
  id uuid references auth.users on delete cascade,
  email text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz default timezone('utc'::text, now()),
  primary key (id)
);

-- Blog posts
create table if not exists posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content jsonb, -- TipTap JSON
  cover_image text,
  status content_status default 'draft',
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  author_id uuid references auth.users(id) on delete cascade,
  view_count integer default 0,
  reading_time_minutes integer
);

-- Projects
create table if not exists projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  description text,
  content jsonb,
  cover_image text,
  tech_stack text[], -- Array of technologies
  project_url text,
  github_url text,
  status content_status default 'draft',
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  author_id uuid references auth.users(id) on delete cascade,
  featured boolean default false
);

-- Tags
create table if not exists tags (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  slug text unique not null,
  color text default '#6366f1',
  created_at timestamptz default now()
);

-- Many-to-many relationships
create table if not exists post_tags (
  post_id uuid references posts(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (post_id, tag_id)
);

create table if not exists project_tags (
  project_id uuid references projects(id) on delete cascade,
  tag_id uuid references tags(id) on delete cascade,
  primary key (project_id, tag_id)
);

-- Updated_at trigger helper
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Attach triggers
create trigger set_posts_updated_at
before update on posts
for each row execute function set_updated_at();

create trigger set_projects_updated_at
before update on projects
for each row execute function set_updated_at();

-- Enable Row Level Security
alter table profiles enable row level security;
alter table posts enable row level security;
alter table projects enable row level security;
alter table tags enable row level security;
alter table post_tags enable row level security;
alter table project_tags enable row level security;

-- RLS Policies
-- Profiles: owner can read/update own profile. Insert allowed for authenticated user with matching id.
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Read own profile'
  ) THEN
    EXECUTE 'create policy "Read own profile" on profiles for select using (auth.uid() = id)';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Update own profile'
  ) THEN
    EXECUTE 'create policy "Update own profile" on profiles for update using (auth.uid() = id)';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'profiles' AND policyname = 'Insert own profile'
  ) THEN
    EXECUTE 'create policy "Insert own profile" on profiles for insert with check (auth.uid() = id)';
  END IF;
END $$;

-- Posts: public can read published; author can full access
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'posts' AND policyname = 'Anyone can view published posts'
  ) THEN
    EXECUTE 'create policy "Anyone can view published posts" on posts for select using (status = ''published'' and coalesce(published_at, now()) <= now())';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'posts' AND policyname = 'Admin full access to posts'
  ) THEN
    EXECUTE 'create policy "Admin full access to posts" on posts for all using (auth.uid() = author_id)';
  END IF;
END $$;

-- Projects: public can read published; author can full access
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Anyone can view published projects'
  ) THEN
    EXECUTE 'create policy "Anyone can view published projects" on projects for select using (status = ''published'' and coalesce(published_at, now()) <= now())';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'projects' AND policyname = 'Admin full access to projects'
  ) THEN
    EXECUTE 'create policy "Admin full access to projects" on projects for all using (auth.uid() = author_id)';
  END IF;
END $$;

-- Tags: anyone read; only authenticated admin (presence in profiles) can modify
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tags' AND policyname = 'Anyone can read tags'
  ) THEN
    EXECUTE 'create policy "Anyone can read tags" on tags for select using (true)';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tags' AND policyname = 'Admin can modify tags'
  ) THEN
    EXECUTE 'create policy "Admin can modify tags" on tags for all using (exists (select 1 from profiles p where p.id = auth.uid()))';
  END IF;
END $$;

-- post_tags and project_tags: only author of post/project may modify; public can read via joins implicitly when selecting posts/projects
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'post_tags' AND policyname = 'Author can modify post_tags'
  ) THEN
    EXECUTE 'create policy "Author can modify post_tags" on post_tags for all using (exists (select 1 from posts p where p.id = post_id and p.author_id = auth.uid()))';
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'project_tags' AND policyname = 'Author can modify project_tags'
  ) THEN
    EXECUTE 'create policy "Author can modify project_tags" on project_tags for all using (exists (select 1 from projects pr where pr.id = project_id and pr.author_id = auth.uid()))';
  END IF;
END $$;

