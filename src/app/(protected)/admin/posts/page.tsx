import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AdminPostsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: posts, error } = await supabase
    .from('posts')
    .select(
      'id, title, slug, status, post_type, featured, published_at, updated_at'
    )
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) {
    return (
      <div className="card-8bit p-4">
        <p className="text-[var(--accent-error)]">
          Error loading posts: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl text-[var(--accent-primary)]"
          style={{ fontFamily: 'Press Start 2P, monospace' }}
        >
          POSTS MANAGER
        </h1>
        <Link
          href="/admin/posts/new"
          className="group border-2 border-[var(--border-color)] bg-[var(--accent-primary)] px-4 py-2 font-mono font-bold text-white transition-all hover:shadow-[4px_4px_0px_0px_var(--accent-secondary)]"
        >
          <span
            className="mr-2"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            [+]
          </span>
          NEW POST
        </Link>
      </div>

      {/* Stats Bar */}
      <div className="flex gap-4">
        <div className="border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2">
          <span className="font-mono text-xs text-[var(--text-muted)]">
            TOTAL:
          </span>
          <span className="ml-2 font-mono font-bold">{posts?.length || 0}</span>
        </div>
        <div className="border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2">
          <span className="font-mono text-xs text-[var(--text-muted)]">
            PUBLISHED:
          </span>
          <span className="ml-2 font-mono font-bold">
            {posts?.filter(p => p.status === 'published').length || 0}
          </span>
        </div>
        <div className="border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] px-4 py-2">
          <span className="font-mono text-xs text-[var(--text-muted)]">
            DRAFTS:
          </span>
          <span className="ml-2 font-mono font-bold">
            {posts?.filter(p => p.status === 'draft').length || 0}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-4 border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <table className="w-full">
          <thead className="border-b-2 border-[var(--border-color)] bg-[var(--bg-tertiary)]">
            <tr>
              <th className="p-4 text-left">
                <span className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
                  TITLE
                </span>
              </th>
              <th className="p-4 text-left">
                <span className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
                  TYPE
                </span>
              </th>
              <th className="p-4 text-left">
                <span className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
                  STATUS
                </span>
              </th>
              <th className="p-4 text-center">
                <span className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
                  FEATURED
                </span>
              </th>
              <th className="p-4 text-center">
                <span className="font-mono text-xs font-bold text-[var(--text-primary)] uppercase">
                  ACTIONS
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {posts?.map((p, index) => (
              <tr
                key={p.id}
                className={`border-b border-[var(--border-color)] transition-colors hover:bg-[var(--bg-tertiary)] ${
                  index % 2 === 0
                    ? 'bg-[var(--bg-primary)]'
                    : 'bg-[var(--bg-secondary)]'
                }`}
              >
                <td className="p-4">
                  <Link
                    className="font-mono text-sm font-bold text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] hover:underline"
                    href={`/admin/posts/${p.id}/edit`}
                  >
                    {p.title}
                  </Link>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block border px-2 py-1 font-mono text-xs font-bold ${
                      p.post_type === 'project'
                        ? 'border-[var(--nord14)] bg-[var(--nord14)] text-white'
                        : p.post_type === 'announcement'
                          ? 'border-[var(--nord13)] bg-[var(--nord13)] text-[var(--bg-primary)]'
                          : 'border-[var(--nord10)] bg-[var(--nord10)] text-white'
                    }`}
                  >
                    {p.post_type || 'POST'}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`inline-block border px-2 py-1 font-mono text-xs font-bold ${
                      p.status === 'published'
                        ? 'border-[var(--nord14)] bg-[var(--nord14)] text-white'
                        : p.status === 'scheduled'
                          ? 'border-[var(--nord13)] bg-[var(--nord13)] text-[var(--bg-primary)]'
                          : 'border-[var(--border-color)] bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {p.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 text-center">
                  {p.featured ? (
                    <span
                      className="inline-block text-[var(--nord13)]"
                      style={{ fontFamily: 'Press Start 2P, monospace' }}
                    >
                      ★
                    </span>
                  ) : (
                    <span className="text-[var(--text-muted)]">-</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Link
                      href={`/admin/posts/${p.id}/edit`}
                      className="border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-1 font-mono text-xs transition-all hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white"
                    >
                      EDIT
                    </Link>
                    <Link
                      href={`/#post-${p.id}`}
                      className="border border-[var(--border-color)] bg-[var(--bg-primary)] px-2 py-1 font-mono text-xs transition-all hover:border-[var(--nord10)] hover:bg-[var(--nord10)] hover:text-white"
                    >
                      VIEW
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
            {(!posts || posts.length === 0) && (
              <tr>
                <td className="p-8 text-center" colSpan={5}>
                  <div className="text-center">
                    <div
                      className="mb-4 text-4xl opacity-20"
                      style={{ fontFamily: 'Press Start 2P, monospace' }}
                    >
                      [ ]
                    </div>
                    <p className="font-mono text-sm text-[var(--text-muted)]">
                      No posts yet.
                    </p>
                    <Link
                      href="/admin/posts/new"
                      className="mt-4 inline-block border-2 border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2 font-mono text-sm transition-all hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white"
                    >
                      CREATE YOUR FIRST POST
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
