'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { uploadImage } from '@/lib/upload';

// Dynamically import the editor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import('@/components/editor/RichTextEditor'),
  { ssr: false }
);

export default function EditPostClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState('draft');
  const [postType, setPostType] = useState('post');
  const [featured, setFeatured] = useState(false);
  const [techStack, setTechStack] = useState('');
  const [projectUrl, setProjectUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [mediaUrls, setMediaUrls] = useState('');
  const [publishedAt, setPublishedAt] = useState<string>('');
  const [createdAt, setCreatedAt] = useState<string>('');

  const supabase = createSupabaseBrowserClient();

  // Load post data
  useEffect(() => {
    async function loadPost() {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error loading post:', error);
        return;
      }

      // Debug logging
      console.log('Loaded post data:', data);
      console.log('Content field:', data.content);
      console.log('Content type:', typeof data.content);

      setPost(data);
      setTitle(data.title || '');
      setExcerpt(data.excerpt || '');
      setContent(data.content || null);
      setStatus(data.status || 'draft');
      setPostType(data.post_type || 'post');
      setFeatured(data.featured || false);
      setTechStack(data.tech_stack?.join(', ') || '');
      setProjectUrl(data.project_url || '');
      setGithubUrl(data.github_url || '');

      // Convert media attachments to URLs
      const mediaAttachments =
        (data.media_attachments as Array<{ url: string }>) || [];
      setMediaUrls(mediaAttachments.map(m => m.url).join('\n'));

      // Set date fields (convert to datetime-local format)
      if (data.published_at) {
        const pubDate = new Date(data.published_at as string);
        setPublishedAt(pubDate.toISOString().slice(0, 16));
      }
      if (data.created_at) {
        const createDate = new Date(data.created_at as string);
        setCreatedAt(createDate.toISOString().slice(0, 16));
      }

      setLoading(false);
    }

    loadPost();
  }, [id, supabase]);

  // Auto-save functionality
  useEffect(() => {
    if (!post || !content) return;

    const timer = setTimeout(async () => {
      setAutoSaveStatus('Saving...');

      const { error } = await supabase
        .from('posts')
        .update({
          content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) {
        setAutoSaveStatus('Save failed');
        console.error('Auto-save error:', error);
      } else {
        setAutoSaveStatus('Saved');
      }

      setTimeout(() => setAutoSaveStatus(''), 3000);
    }, 5000); // Save after 5 seconds of no changes

    return () => clearTimeout(timer);
  }, [content, id, post, supabase]);

  const handleSave = async () => {
    setSaving(true);

    const media_urls = mediaUrls
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);
    const media_attachments = media_urls.map(url => ({ url, type: 'image' }));

    // Convert datetime-local values to ISO strings
    const publishedISO = publishedAt
      ? new Date(publishedAt).toISOString()
      : null;
    const createdISO = createdAt
      ? new Date(createdAt).toISOString()
      : new Date().toISOString();

    const { error } = await supabase
      .from('posts')
      .update({
        title,
        excerpt,
        content,
        status,
        post_type: postType,
        featured,
        project_url: projectUrl || null,
        github_url: githubUrl || null,
        tech_stack:
          postType === 'project'
            ? techStack
                .split(',')
                .map(s => s.trim())
                .filter(Boolean)
            : null,
        media_attachments,
        published_at: publishedISO,
        created_at: createdISO,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    setSaving(false);

    if (error) {
      alert('Error saving post: ' + error.message);
      return;
    }

    router.push('/admin/posts');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const url = await uploadImage(file);
    setUploadingImage(false);

    if (url) {
      setMediaUrls(prev => (prev ? `${prev}\n${url}` : url));
    } else {
      alert('Failed to upload image');
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    const { error } = await supabase.from('posts').delete().eq('id', id);

    if (error) {
      alert('Error deleting post: ' + error.message);
      return;
    }

    router.push('/admin/posts');
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-mono text-2xl">Edit Post</h1>
        <div className="flex items-center gap-4">
          {autoSaveStatus && (
            <span className="text-xs text-[var(--text-muted)]">
              {autoSaveStatus}
            </span>
          )}
          <Link href="/admin/posts" className="btn-8bit px-3 py-2 text-sm">
            Back to Posts
          </Link>
        </div>
      </div>

      <div className="grid gap-6">
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
          {content === null && (
            <div className="mb-2 text-xs text-[var(--text-muted)]">
              [Initializing editor with empty content...]
            </div>
          )}
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
        <div className="flex justify-between">
          <button
            onClick={handleDelete}
            className="btn-8bit bg-[var(--accent-error)] px-4 py-2"
          >
            Delete Post
          </button>

          <div className="flex gap-3">
            <Link href="/admin/posts" className="btn-8bit px-4 py-2">
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-8bit bg-[var(--accent-primary)] px-4 py-2"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
