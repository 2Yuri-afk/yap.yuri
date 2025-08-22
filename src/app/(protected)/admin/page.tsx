import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function AdminHome() {
  const supabase = await createSupabaseServerClient();

  // Fetch statistics
  const [postsResult, draftsResult, projectsResult] = await Promise.all([
    supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'published'),
    supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'draft'),
    supabase
      .from('posts')
      .select('id', { count: 'exact', head: true })
      .eq('post_type', 'project'),
  ]);

  // Fetch recent posts
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('id, title, status, post_type, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const stats = {
    published: postsResult.count || 0,
    drafts: draftsResult.count || 0,
    projects: projectsResult.count || 0,
    total: (postsResult.count || 0) + (draftsResult.count || 0),
  };

  return (
    <div className="grid gap-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden border-4 border-[var(--border-color)] bg-gradient-to-br from-[var(--accent-primary)] to-[var(--accent-secondary)] p-6 text-white">
        <div className="relative z-10">
          <h1
            className="mb-2 text-2xl"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            Admin Dashboard
          </h1>
          <p className="font-mono text-sm opacity-90">
            Welcome back to your command center!
          </p>
        </div>

        {/* Pixel art decoration */}
        <div
          className="absolute -top-4 -right-4 text-6xl opacity-20"
          style={{ fontFamily: 'Press Start 2P, monospace' }}
        >
          [ADMIN]
        </div>
        <div
          className="absolute -bottom-4 -left-4 text-6xl opacity-20"
          style={{ fontFamily: 'Press Start 2P, monospace' }}
        >
          [ZONE]
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Published Posts */}
        <div className="group relative overflow-hidden border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 transition-all hover:border-[var(--accent-primary)] hover:shadow-[4px_4px_0px_0px_var(--accent-primary)]">
          <div className="mb-2 flex items-center justify-between">
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: 'Press Start 2P, monospace' }}
            >
              [P]
            </span>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              PUBLISHED
            </span>
          </div>
          <div
            className="text-3xl font-bold"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            {stats.published}
          </div>
          <p className="mt-1 font-mono text-xs text-[var(--text-secondary)]">
            Active posts
          </p>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-[var(--accent-primary)] transition-all group-hover:h-2"></div>
        </div>

        {/* Drafts */}
        <div className="group relative overflow-hidden border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 transition-all hover:border-[var(--nord13)] hover:shadow-[4px_4px_0px_0px_var(--nord13)]">
          <div className="mb-2 flex items-center justify-between">
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: 'Press Start 2P, monospace' }}
            >
              [D]
            </span>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              DRAFTS
            </span>
          </div>
          <div
            className="text-3xl font-bold"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            {stats.drafts}
          </div>
          <p className="mt-1 font-mono text-xs text-[var(--text-secondary)]">
            In progress
          </p>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-[var(--nord13)] transition-all group-hover:h-2"></div>
        </div>

        {/* Projects */}
        <div className="group relative overflow-hidden border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 transition-all hover:border-[var(--nord14)] hover:shadow-[4px_4px_0px_0px_var(--nord14)]">
          <div className="mb-2 flex items-center justify-between">
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: 'Press Start 2P, monospace' }}
            >
              [*]
            </span>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              PROJECTS
            </span>
          </div>
          <div
            className="text-3xl font-bold"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            {stats.projects}
          </div>
          <p className="mt-1 font-mono text-xs text-[var(--text-secondary)]">
            Showcased
          </p>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-[var(--nord14)] transition-all group-hover:h-2"></div>
        </div>

        {/* Total */}
        <div className="group relative overflow-hidden border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] p-4 transition-all hover:border-[var(--nord15)] hover:shadow-[4px_4px_0px_0px_var(--nord15)]">
          <div className="mb-2 flex items-center justify-between">
            <span
              className="text-2xl font-bold"
              style={{ fontFamily: 'Press Start 2P, monospace' }}
            >
              [T]
            </span>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              TOTAL
            </span>
          </div>
          <div
            className="text-3xl font-bold"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            {stats.total}
          </div>
          <p className="mt-1 font-mono text-xs text-[var(--text-secondary)]">
            All posts
          </p>
          <div className="absolute bottom-0 left-0 h-1 w-full bg-[var(--nord15)] transition-all group-hover:h-2"></div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="border-2 border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="border-b-2 border-[var(--border-color)] bg-[var(--bg-tertiary)] p-4">
            <h2
              className="font-bold"
              style={{ fontFamily: 'Press Start 2P, monospace' }}
            >
              QUICK ACTIONS
            </h2>
          </div>
          <div className="grid gap-3 p-4">
            <Link
              href="/admin/posts/new"
              className="group flex items-center gap-3 border-2 border-[var(--border-color)] bg-[var(--bg-primary)] p-3 transition-all hover:border-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white"
            >
              <span
                className="text-xl font-bold transition-transform group-hover:scale-110"
                style={{ fontFamily: 'Press Start 2P, monospace' }}
              >
                [+]
              </span>
              <div>
                <div className="font-mono text-sm font-bold">
                  Create New Post
                </div>
                <div className="font-mono text-xs opacity-75">
                  Start writing something amazing
                </div>
              </div>
            </Link>

            <Link
              href="/admin/posts"
              className="group flex items-center gap-3 border-2 border-[var(--border-color)] bg-[var(--bg-primary)] p-3 transition-all hover:border-[var(--nord10)] hover:bg-[var(--nord10)] hover:text-white"
            >
              <span
                className="text-xl font-bold transition-transform group-hover:scale-110"
                style={{ fontFamily: 'Press Start 2P, monospace' }}
              >
                [=]
              </span>
              <div>
                <div className="font-mono text-sm font-bold">Manage Posts</div>
                <div className="font-mono text-xs opacity-75">
                  View and edit all content
                </div>
              </div>
            </Link>

            <Link
              href="/admin/settings"
              className="group flex items-center gap-3 border-2 border-[var(--border-color)] bg-[var(--bg-primary)] p-3 transition-all hover:border-[var(--nord15)] hover:bg-[var(--nord15)] hover:text-white"
            >
              <span
                className="text-xl font-bold transition-transform group-hover:rotate-180"
                style={{ fontFamily: 'Press Start 2P, monospace' }}
              >
                [*]
              </span>
              <div>
                <div className="font-mono text-sm font-bold">Site Settings</div>
                <div className="font-mono text-xs opacity-75">
                  Edit sidebar cards & status
                </div>
              </div>
            </Link>

            <Link
              href="/"
              target="_blank"
              className="group flex items-center gap-3 border-2 border-[var(--border-color)] bg-[var(--bg-primary)] p-3 transition-all hover:border-[var(--nord14)] hover:bg-[var(--nord14)] hover:text-white"
            >
              <span
                className="text-xl font-bold transition-transform group-hover:translate-x-1"
                style={{ fontFamily: 'Press Start 2P, monospace' }}
              >
                [&gt;]
              </span>
              <div>
                <div className="font-mono text-sm font-bold">View Site</div>
                <div className="font-mono text-xs opacity-75">
                  See your live website
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="border-2 border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="border-b-2 border-[var(--border-color)] bg-[var(--bg-tertiary)] p-4">
            <h2
              className="font-bold"
              style={{ fontFamily: 'Press Start 2P, monospace' }}
            >
              RECENT POSTS
            </h2>
          </div>
          <div className="p-4">
            {recentPosts && recentPosts.length > 0 ? (
              <div className="space-y-2">
                {recentPosts.map(post => (
                  <Link
                    key={post.id}
                    href={`/admin/posts/${post.id}`}
                    className="block border-l-4 border-transparent bg-[var(--bg-primary)] p-3 transition-all hover:border-[var(--accent-primary)] hover:bg-[var(--bg-tertiary)]"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-mono text-sm font-bold">
                          {post.title}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={`inline-block px-2 py-0.5 font-mono text-xs font-bold ${
                              post.status === 'published'
                                ? 'bg-[var(--nord14)] text-white'
                                : 'bg-[var(--nord13)] text-[var(--bg-primary)]'
                            }`}
                          >
                            {post.status}
                          </span>
                          <span className="font-mono text-xs text-[var(--text-muted)]">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <span className="text-[var(--text-muted)] transition-transform hover:translate-x-1">
                        &gt;
                      </span>
                    </div>
                  </Link>
                ))}
                <Link
                  href="/admin/posts"
                  className="mt-2 block text-center font-mono text-sm text-[var(--accent-primary)] hover:underline"
                >
                  View all posts &gt;&gt;
                </Link>
              </div>
            ) : (
              <p className="font-mono text-sm text-[var(--text-muted)]">
                No posts yet. Create your first post!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
