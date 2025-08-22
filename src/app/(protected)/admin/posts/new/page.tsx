'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { uploadImage } from '@/lib/upload';
import { slugify } from '@/lib/slugify';

// Dynamically import the editor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import('@/components/editor/RichTextEditor'),
  { ssr: false }
);

export default function NewPostPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [postType, setPostType] = useState('post');
  const [status, setStatus] = useState('draft');
  const [featured, setFeatured] = useState(false);
  const [techStack, setTechStack] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [mediaUrls, setMediaUrls] = useState('');
  const [publishedAt, setPublishedAt] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>(() =>
    new Date().toISOString().slice(0, 16)
  );

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('Uploading file:', file.name, file.size, file.type);
    setUploadingImage(true);

    try {
      const url = await uploadImage(file);
      console.log('Upload result:', url);
      setUploadingImage(false);

      if (url) {
        setMediaUrls(prev => (prev ? `${prev}\n${url}` : url));
      } else {
        alert('Failed to upload image - check console for details');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadingImage(false);
      alert('Failed to upload image: ' + (error as Error).message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert('You must be logged in to create posts');
      setSaving(false);
      return;
    }

    // Process media URLs into structured format
    const media_urls = mediaUrls
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    const media_attachments = media_urls.map(url => {
      return { url, type: 'image' };
    });

    // Generate slug from title
    const slug = slugify(title);

    // Convert datetime-local values to ISO strings
    const publishedISO = publishedAt
      ? new Date(publishedAt).toISOString()
      : null;
    const createdISO = createdAt
      ? new Date(createdAt).toISOString()
      : new Date().toISOString();

    const { error } = await supabase
      .from('posts')
      .insert({
        title,
        slug,
        excerpt,
        content,
        post_type: postType,
        status,
        featured,
        author_id: user.id,
        project_url: projectUrl || null,
        github_url: githubUrl || null,
        tech_stack:
          postType === 'project'
            ? techStack
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
            : null,
        media_attachments:
          media_attachments.length > 0 ? media_attachments : null,
        published_at: publishedISO,
        created_at: createdISO,
        updated_at: new Date().toISOString(),
      })
      .select();

    setSaving(false);

    if (error) {
      console.error('Error creating post:', error);
      alert('Error creating post: ' + error.message);
      return;
    }

    console.log('Post created successfully');
    router.push('/admin/posts');
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-mono text-2xl">New Post</h1>
        <Link href="/admin/posts" className="btn-8bit px-3 py-2 text-sm">
          Back to Posts
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Basic Info */}
        <div className="card-8bit grid gap-4 p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-sm">Post Type</label>
              <select
                className="input-8bit w-full px-3 py-2"
                value={postType}
                onChange={e => setPostType(e.target.value)}
              >
                <option value="post">Regular Post</option>
                <option value="project">Project</option>
                <option value="announcement">Announcement</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-sm">Status</label>
              <select
                className="input-8bit w-full px-3 py-2"
                value={status}
                onChange={e => {
                  const newStatus = e.target.value;
                  setStatus(newStatus);

                  // Auto-manage published_at based on status
                  if (newStatus === 'scheduled' && !publishedAt) {
                    // Pre-fill with current time if switching to scheduled
                    setPublishedAt(new Date().toISOString().slice(0, 16));
                  } else if (newStatus === 'published' && !publishedAt) {
                    // Set to now if publishing immediately
                    setPublishedAt(new Date().toISOString().slice(0, 16));
                  }
                }}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-mono text-sm">Title</label>
            <input
              className="input-8bit w-full px-3 py-2"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="font-mono text-sm">Excerpt</label>
            <textarea
              className="input-8bit w-full px-3 py-2"
              rows={3}
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
            />
          </div>

          <label className="flex items-center gap-2 font-mono text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={e => setFeatured(e.target.checked)}
            />
            Featured
          </label>

          <div>
            <label className="font-mono text-sm">Post Date</label>
            <input
              type="datetime-local"
              className="input-8bit w-full px-3 py-2"
              value={publishedAt || createdAt}
              onChange={e => {
                setPublishedAt(e.target.value);
                setCreatedAt(e.target.value);
              }}
            />
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Controls when this post appears on your site
            </p>
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className="card-8bit p-6">
          <label className="mb-2 block font-mono text-sm">Content</label>
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="Write your post content..."
          />
        </div>

        {/* Project Fields */}
        {postType === 'project' && (
          <details className="card-8bit p-6" open>
            <summary className="mb-4 cursor-pointer font-mono text-sm">
              Project Details
            </summary>
            <div className="grid gap-4">
              <div>
                <label className="font-mono text-sm">
                  Tech Stack (comma separated)
                </label>
                <input
                  className="input-8bit w-full px-3 py-2"
                  placeholder="Next.js, TypeScript, Supabase"
                  value={techStack}
                  onChange={e => setTechStack(e.target.value)}
                />
              </div>

              <div>
                <label className="font-mono text-sm">Project URL</label>
                <input
                  className="input-8bit w-full px-3 py-2"
                  type="url"
                  value={projectUrl}
                  onChange={e => setProjectUrl(e.target.value)}
                />
              </div>

              <div>
                <label className="font-mono text-sm">GitHub URL</label>
                <input
                  className="input-8bit w-full px-3 py-2"
                  type="url"
                  value={githubUrl}
                  onChange={e => setGithubUrl(e.target.value)}
                />
              </div>
            </div>
          </details>
        )}

        {/* Media */}
        <div className="card-8bit p-6">
          <label className="mb-2 block font-mono text-sm">Media</label>

          <div className="mb-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={uploadingImage}
            />
            <label
              htmlFor="image-upload"
              className="btn-8bit inline-block cursor-pointer px-3 py-2 text-sm"
            >
              {uploadingImage ? 'Uploading...' : 'Upload Image'}
            </label>
          </div>

          <textarea
            className="input-8bit w-full px-3 py-2"
            rows={4}
            placeholder="Image URLs (one per line)"
            value={mediaUrls}
            onChange={e => setMediaUrls(e.target.value)}
          />

          {/* Preview images */}
          {mediaUrls && (
            <div className="mt-4 grid grid-cols-3 gap-2">
              {mediaUrls
                .split('\n')
                .filter(Boolean)
                .map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt=""
                    className="h-24 w-full border-2 border-[var(--text-secondary)] object-cover"
                  />
                ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link href="/admin/posts" className="btn-8bit px-4 py-2">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn-8bit bg-[var(--accent-primary)] px-4 py-2"
          >
            {saving ? 'Creating...' : 'Create Post'}
          </button>
        </div>
      </form>
    </div>
  );
}
