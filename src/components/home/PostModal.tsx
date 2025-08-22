'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import RichContent from '@/components/editor/RichContent';

interface PostModalProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content?: any;
    post_type: string;
    featured: boolean;
    media_attachments?: Array<{ url: string }>;
    tech_stack?: string[];
    project_url?: string;
    github_url?: string;
    published_at: string;
    created_at: string;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PostModal({
  post,
  open,
  onOpenChange,
}: PostModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [fullPost, setFullPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If we already have content in the post prop, use it
    if (post.content) {
      setFullPost(post);
    } else if (open && !fullPost) {
      // Only load if we don't have content
      loadFullPost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, post.content]);

  const loadFullPost = async () => {
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', post.id)
        .single();

      if (!error && data) {
        setFullPost(data);
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const postDate = new Date(post.published_at || post.created_at);
  const formattedDate = postDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="scrollbar-hide max-h-[90vh] w-full max-w-3xl overflow-y-auto border-2 border-[var(--border-color)] bg-[var(--bg-primary)] p-0">
        {/* Hidden title for accessibility */}
        <VisuallyHidden>
          <DialogTitle>{post.title}</DialogTitle>
        </VisuallyHidden>

        {/* Custom styled header */}
        <div className="sticky top-0 z-10 border-b-2 border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
          {/* macOS style close button */}
          <button
            type="button"
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onOpenChange(false);
            }}
            className="group absolute top-4 right-4 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--nord11)] transition-all hover:bg-[var(--nord11)] hover:brightness-110"
            aria-label="Close modal"
          >
            <span className="text-[10px] font-bold text-white opacity-0 transition-opacity group-hover:opacity-100">
              ×
            </span>
          </button>

          <div className="flex items-start gap-3 pr-8">
            {/* Avatar */}
            <div className="h-12 w-12 flex-shrink-0 overflow-hidden border border-[var(--border-color)] bg-[var(--bg-tertiary)]">
              <Image
                src="/profile.jpg"
                alt="Yuri's profile picture"
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold">yuri</span>
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  @yap.yuri
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  {formattedDate}
                </span>
                {post.featured && (
                  <span className="text-xs text-[var(--nord13)]">
                    ★ Featured
                  </span>
                )}
                <span
                  className={`inline-block px-2 py-0.5 text-xs font-bold ${
                    post.post_type === 'project'
                      ? 'bg-[var(--nord14)] text-[var(--bg-primary)]' // green
                      : post.post_type === 'announcement'
                        ? 'bg-[var(--nord13)] text-[var(--bg-primary)]' // yellow
                        : 'bg-[var(--nord10)] text-white' // blue
                  }`}
                >
                  {post.post_type}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-6">
          {/* Title */}
          <h1
            className="mb-4 text-2xl leading-tight"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            {post.title}
          </h1>

          {/* Media */}
          {post.media_attachments && post.media_attachments.length > 0 && (
            <div className="mb-6">
              {post.media_attachments.length === 1 ? (
                <div className="relative overflow-hidden border-2 border-[var(--border-color)] bg-[var(--bg-tertiary)]">
                  {/* Fixed aspect ratio container */}
                  <div className="relative h-[400px] w-full">
                    <img
                      src={post.media_attachments[0]?.url}
                      alt="Post image"
                      className="absolute inset-0 h-full w-full object-contain"
                      style={{ imageRendering: 'crisp-edges' }}
                    />
                  </div>
                </div>
              ) : (
                <Carousel className="w-full">
                  <CarouselContent>
                    {post.media_attachments.map((media, index) => (
                      <CarouselItem key={index}>
                        <div className="relative overflow-hidden border-2 border-[var(--border-color)] bg-[var(--bg-tertiary)]">
                          {/* Fixed aspect ratio container */}
                          <div className="relative h-[400px] w-full">
                            <img
                              src={media.url}
                              alt={`Post image ${index + 1}`}
                              className="absolute inset-0 h-full w-full object-contain"
                              style={{ imageRendering: 'crisp-edges' }}
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-white" />
                  <CarouselNext className="right-2 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] text-[var(--text-primary)] hover:bg-[var(--accent-primary)] hover:text-white" />
                </Carousel>
              )}
            </div>
          )}

          {/* Content Section */}
          <div className="mb-6 border-2 border-[var(--border-color)] bg-[var(--bg-tertiary)] p-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="pixel-loader">
                  {[...Array(8)].map((_, i) => (
                    <span key={i} />
                  ))}
                </div>
              </div>
            ) : fullPost?.content ? (
              <div className="prose prose-invert max-w-none">
                <RichContent content={fullPost.content} />
              </div>
            ) : post.excerpt ? (
              <p className="text-lg leading-relaxed text-[var(--text-secondary)]">
                {post.excerpt}
              </p>
            ) : (
              <p className="text-lg leading-relaxed text-[var(--text-muted)]">
                No content available yet.
              </p>
            )}
          </div>

          {/* Project Details Section - for project type posts */}
          {post.post_type === 'project' &&
            (post.project_url || post.github_url) && (
              <div className="mb-6 border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
                <h3 className="mb-3 font-mono text-sm font-bold tracking-wider text-[var(--text-primary)] uppercase">
                  Project Links
                </h3>
                <div className="flex flex-wrap gap-3">
                  {post.project_url && (
                    <a
                      href={post.project_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border-2 border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 font-mono text-sm text-[var(--text-primary)] transition-all hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white"
                    >
                      <span>🌐</span>
                      <span>View Live Project</span>
                    </a>
                  )}
                  {post.github_url && (
                    <a
                      href={post.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border-2 border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-2 font-mono text-sm text-[var(--text-primary)] transition-all hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white"
                    >
                      <svg
                        className="h-4 w-4 fill-current"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span>View on GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            )}

          {/* Tech Stack Section */}
          {post.tech_stack && post.tech_stack.length > 0 && (
            <div className="border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
              <h3 className="mb-3 font-mono text-sm font-bold tracking-wider text-[var(--text-primary)] uppercase">
                Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tech_stack.map(tech => (
                  <span
                    key={tech}
                    className="border border-[var(--border-color)] bg-[var(--bg-primary)] px-3 py-1 font-mono text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--accent-primary)] hover:text-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
