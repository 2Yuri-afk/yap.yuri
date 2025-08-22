import Link from 'next/link';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    excerpt?: string;
    slug: string;
    post_type: string;
    featured?: boolean;
    created_at: string;
    media_attachments?: Array<{ url: string }>;
    tech_stack?: string[];
  };
}

export default function PostCard({ post }: PostCardProps) {
  const postTypeColors = {
    post: 'var(--nord8)',
    project: 'var(--nord14)',
    announcement: 'var(--nord13)',
  };

  const postTypeIcons = {
    post: '📝',
    project: '🚀',
    announcement: '📢',
  };

  return (
    <article className="card-elevated group">
      {/* Post type badge */}
      <div className="absolute -top-2 -right-2 z-10">
        <div
          className="px-3 py-1 font-mono text-xs uppercase"
          style={{
            background:
              postTypeColors[post.post_type as keyof typeof postTypeColors] ||
              'var(--accent-primary)',
            color: 'var(--bg-primary)',
            border: '2px solid var(--bg-primary)',
          }}
        >
          {postTypeIcons[post.post_type as keyof typeof postTypeIcons]}{' '}
          {post.post_type}
        </div>
      </div>

      {/* Featured badge */}
      {post.featured && (
        <div className="absolute -top-2 -left-2 z-10">
          <div className="flex h-8 w-8 items-center justify-center bg-[var(--nord13)] text-xs font-bold text-[var(--bg-primary)]">
            ⭐
          </div>
        </div>
      )}

      {/* Media preview */}
      {post.media_attachments && post.media_attachments.length > 0 && (
        <div className="h-48 overflow-hidden border-b-2 border-[var(--border-color)]">
          <img
            src={post.media_attachments[0]?.url || ''}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            style={{ imageRendering: 'auto' }}
          />
        </div>
      )}

      <div className="p-6">
        {/* Title */}
        <h3 className="mb-3 text-lg transition-colors group-hover:text-[var(--accent-primary)]">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="mb-4 line-clamp-2 text-sm text-[var(--text-muted)]">
            {post.excerpt}
          </p>
        )}

        {/* Tech stack for projects */}
        {post.post_type === 'project' && post.tech_stack && (
          <div className="mb-4 flex flex-wrap gap-2">
            {post.tech_stack.slice(0, 3).map((tech, idx) => (
              <span
                key={idx}
                className="bg-[var(--bg-tertiary)] px-2 py-1 font-mono text-xs text-[var(--nord7)]"
              >
                {tech}
              </span>
            ))}
            {post.tech_stack.length > 3 && (
              <span className="px-2 py-1 font-mono text-xs text-[var(--text-muted)]">
                +{post.tech_stack.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-4">
          <time className="font-mono text-xs text-[var(--text-muted)]">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </time>

          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1 font-mono text-xs text-[var(--accent-primary)] hover:text-[var(--accent-hover)]"
          >
            READ MORE
            <span className="inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
