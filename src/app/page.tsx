import { createSupabaseServerClient } from '@/lib/supabase/server';
import AboutCard from '@/components/home/AboutCard';
import FeedPost from '@/components/home/FeedPost';
import ScrollToPost from '@/components/home/ScrollToPost';
import AmongUsCard from '@/components/home/AmongUsCard';
import KonamiEasterEgg from '@/components/home/KonamiEasterEgg';
export default async function Home() {
  const supabase = await createSupabaseServerClient();

  // Get all recent posts
  const { data: posts } = await supabase
    .from('posts')
    .select(
      'id, title, slug, excerpt, content, post_type, featured, media_attachments, tech_stack, project_url, github_url, published_at, created_at'
    )
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(50);

  const allPosts = posts || [];

  // Get site settings
  const { data: settingsData } = await supabase
    .from('site_settings')
    .select('key, value')
    .eq('key', 'currently');

  // Parse settings
  const settings: Record<string, unknown> = {};
  settingsData?.forEach(item => {
    settings[item.key] = item.value;
  });

  // Format relative time from ISO timestamp
  function formatRelativeTime(isoString?: string): string {
    if (!isoString) return 'Never';

    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
    const weeks = Math.floor(diffInSeconds / 604800);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  }

  // Default values if not in database
  const currentlySettings = (settings.currently as {
    learning?: string;
    building?: string;
    last_updated_iso?: string;
  }) || {
    learning: 'Rust & WebAssembly',
    building: '8-bit portfolio site',
  };

  // Calculate stats based on post_type
  const stats = {
    posts: allPosts.filter(p => p.post_type === 'post').length, // Regular posts
    projects: allPosts.filter(p => p.post_type === 'project').length, // Projects
    announcements: allPosts.filter(p => p.post_type === 'announcement').length, // Announcements
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <ScrollToPost />
      {/* Dock-style Header Bar with NES Controller Easter Egg */}
      <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
        <div className="dock-container" id="controllerDock">
          {/* Left - A B Buttons */}
          <div className="dock-section controller-buttons">
            <button
              className="nes-button button-b"
              aria-label="B button"
              data-button="B"
            >
              B
            </button>
            <button
              className="nes-button button-a"
              aria-label="A button"
              data-button="A"
            >
              A
            </button>
          </div>

          {/* Center Divider */}
          <div className="dock-divider" />

          {/* Center - Title */}
          <div className="dock-section dock-title">
            <h1
              className="text-sm text-[var(--text-primary)]"
              style={{ fontFamily: 'Press Start 2P, monospace' }}
            >
              yap.yuri
            </h1>
          </div>

          {/* Center Divider */}
          <div className="dock-divider" />

          {/* Right - Start Select Buttons */}
          <div className="dock-section controller-buttons">
            <button
              className="nes-button button-select"
              aria-label="Select button"
              data-button="SELECT"
            >
              SELECT
            </button>
            <button
              className="nes-button button-start"
              aria-label="Start button"
              data-button="START"
            >
              START
            </button>
          </div>
        </div>
      </header>

      {/* Easter Egg Component */}
      <KonamiEasterEgg />

      {/* Spacer for fixed header */}
      <div className="h-20" />

      {/* Three Column Layout */}
      <div className="mx-auto max-w-[90rem] px-4 py-6">
        <div className="flex gap-4 lg:gap-6">
          {/* Left Sidebar */}
          <aside className="hidden w-[280px] flex-shrink-0 xl:block 2xl:w-[320px]">
            <div className="sticky top-24 space-y-3">
              <div className="pixel-card-elevated">
                <AboutCard stats={stats} />
              </div>

              {/* Currently Working On Card */}
              <div className="pixel-card-elevated p-4 lg:p-5">
                <h3
                  className="mb-4 text-center text-sm"
                  style={{ fontFamily: 'Press Start 2P, monospace' }}
                >
                  Currently
                </h3>

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="mt-1 text-[var(--accent-primary)]">▸</span>
                    <div>
                      <div className="font-mono text-xs font-bold text-[var(--text-primary)]">
                        Learning
                      </div>
                      <div className="font-mono text-xs text-[var(--text-muted)]">
                        {currentlySettings.learning}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="mt-1 text-[var(--accent-secondary)]">
                      ▸
                    </span>
                    <div>
                      <div className="font-mono text-xs font-bold text-[var(--text-primary)]">
                        Building
                      </div>
                      <div className="font-mono text-xs text-[var(--text-muted)]">
                        {currentlySettings.building}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 border-t border-[var(--border-color)] pt-3">
                  <div className="text-center">
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      Last update:
                    </span>
                    <span className="font-mono text-xs text-[var(--accent-primary)]">
                      {formatRelativeTime(currentlySettings.last_updated_iso)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* Center - Main Feed */}
          <main className="mx-auto min-w-0 flex-1 lg:max-w-[42rem]">
            {/* Posts Feed */}
            {allPosts.length > 0 ? (
              <div>
                {allPosts.map(post => (
                  <FeedPost
                    key={post.id}
                    post={{
                      ...post,
                      created_at: post.created_at || post.published_at,
                      media_attachments: post.media_attachments as Array<{
                        url: string;
                      }>,
                      tech_stack: post.tech_stack as string[],
                    }}
                  />
                ))}

                {/* End of feed message */}
                <div className="mt-8 text-center">
                  <p className="font-mono text-sm text-[var(--text-muted)]">
                    You&apos;ve reached the end!
                  </p>
                  <p className="mt-2 font-mono text-xs text-[var(--text-secondary)]">
                    Check back later for more posts
                  </p>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="pixel-card p-8 text-center">
                <div className="mb-4 text-4xl">📝</div>
                <h2
                  className="mb-2 text-base"
                  style={{ fontFamily: 'Press Start 2P, monospace' }}
                >
                  No posts yet
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  Check back soon for new content!
                </p>
              </div>
            )}
          </main>

          {/* Right Sidebar */}
          <aside className="hidden w-[280px] flex-shrink-0 xl:block 2xl:w-[320px]">
            <div className="sticky top-24 space-y-3">
              <div className="pixel-card-elevated p-4 lg:p-5">
                <h3
                  className="mb-4 text-center text-xs lg:text-sm"
                  style={{ fontFamily: 'Press Start 2P, monospace' }}
                >
                  Connect
                </h3>

                <div className="space-y-4">
                  {/* GitHub */}
                  <a
                    href="https://github.com/2Yuri-afk"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded border-2 border-[var(--border-color)] bg-[var(--bg-primary)] p-3 transition-all hover:border-[var(--nord4)] hover:bg-[var(--bg-tertiary)]"
                  >
                    <svg
                      className="h-5 w-5 fill-current text-[var(--text-primary)]"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    <div className="flex-1">
                      <div className="font-mono text-sm font-bold group-hover:text-[var(--accent-primary)]">
                        GitHub
                      </div>
                      <div className="font-mono text-xs text-[var(--text-muted)]">
                        /2Yuri-afk
                      </div>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]">
                      →
                    </span>
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href="https://x.com/vulnerablepie"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded border-2 border-[var(--border-color)] bg-[var(--bg-primary)] p-3 transition-all hover:border-[var(--nord4)] hover:bg-[var(--bg-tertiary)]"
                  >
                    <svg
                      className="h-5 w-5 fill-current text-[var(--text-primary)]"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <div className="flex-1">
                      <div className="font-mono text-sm font-bold group-hover:text-[var(--accent-primary)]">
                        X
                      </div>
                      <div className="font-mono text-xs text-[var(--text-muted)]">
                        @vulnerablepie
                      </div>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]">
                      →
                    </span>
                  </a>

                  {/* Instagram */}
                  <a
                    href="https://instagram.com/vulnerablepie2.0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded border-2 border-[var(--border-color)] bg-[var(--bg-primary)] p-3 transition-all hover:border-[var(--nord4)] hover:bg-[var(--bg-tertiary)]"
                  >
                    <svg
                      className="h-5 w-5 fill-current text-[var(--text-primary)]"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                    </svg>
                    <div className="flex-1">
                      <div className="font-mono text-sm font-bold group-hover:text-[var(--accent-primary)]">
                        Instagram
                      </div>
                      <div className="font-mono text-xs text-[var(--text-muted)]">
                        @vulnerablepie2.0
                      </div>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]">
                      →
                    </span>
                  </a>
                </div>

                {/* Optional: Add a message */}
                <div className="mt-6 border-t border-[var(--border-color)] pt-4">
                  <p className="text-center font-mono text-xs text-[var(--text-muted)]">
                    Let&apos;s connect and build something cool!
                  </p>
                </div>
              </div>

              {/* Among Us Card */}
              <AmongUsCard />
            </div>
          </aside>
        </div>

        {/* Mobile Sidebar Cards - Show below main content on mobile */}
        <div className="mt-8 space-y-4 xl:hidden">
          {/* About Card */}
          <div className="pixel-card-elevated">
            <AboutCard stats={stats} />
          </div>

          {/* Currently Card */}
          <div className="pixel-card-elevated p-4">
            <h3
              className="mb-4 text-center text-sm"
              style={{ fontFamily: 'Press Start 2P, monospace' }}
            >
              Currently
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <span className="mt-1 text-[var(--accent-primary)]">▸</span>
                <div>
                  <div className="font-mono text-xs font-bold text-[var(--text-primary)]">
                    Learning
                  </div>
                  <div className="font-mono text-xs text-[var(--text-muted)]">
                    {currentlySettings.learning}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <span className="mt-1 text-[var(--accent-secondary)]">▸</span>
                <div>
                  <div className="font-mono text-xs font-bold text-[var(--text-primary)]">
                    Building
                  </div>
                  <div className="font-mono text-xs text-[var(--text-muted)]">
                    {currentlySettings.building}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 border-t border-[var(--border-color)] pt-3">
              <div className="text-center">
                <span className="font-mono text-xs text-[var(--text-muted)]">
                  Last update:
                </span>
                <span className="font-mono text-xs text-[var(--accent-primary)]">
                  {formatRelativeTime(currentlySettings.last_updated_iso)}
                </span>
              </div>
            </div>
          </div>

          {/* Connect Card */}
          <div className="pixel-card-elevated p-4">
            <h3
              className="mb-4 text-center text-sm"
              style={{ fontFamily: 'Press Start 2P, monospace' }}
            >
              Connect
            </h3>

            <div className="space-y-4">
              {/* GitHub */}
              <a
                href="https://github.com/2Yuri-afk"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded border-2 border-[var(--border-color)] bg-[var(--bg-primary)] p-3 transition-all hover:border-[var(--nord4)] hover:bg-[var(--bg-tertiary)]"
              >
                <svg
                  className="h-5 w-5 fill-current text-[var(--text-primary)]"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <div className="flex-1">
                  <div className="font-mono text-sm font-bold group-hover:text-[var(--accent-primary)]">
                    GitHub
                  </div>
                  <div className="font-mono text-xs text-[var(--text-muted)]">
                    /2Yuri-afk
                  </div>
                </div>
                <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]">
                  →
                </span>
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/vulnerablepie"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded border-2 border-[var(--border-color)] bg-[var(--bg-primary)] p-3 transition-all hover:border-[var(--nord4)] hover:bg-[var(--bg-tertiary)]"
              >
                <svg
                  className="h-5 w-5 fill-current text-[var(--text-primary)]"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <div className="flex-1">
                  <div className="font-mono text-sm font-bold group-hover:text-[var(--accent-primary)]">
                    X
                  </div>
                  <div className="font-mono text-xs text-[var(--text-muted)]">
                    @vulnerablepie
                  </div>
                </div>
                <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]">
                  →
                </span>
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/vulnerablepie2.0"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded border-2 border-[var(--border-color)] bg-[var(--bg-primary)] p-3 transition-all hover:border-[var(--nord4)] hover:bg-[var(--bg-tertiary)]"
              >
                <svg
                  className="h-5 w-5 fill-current text-[var(--text-primary)]"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                </svg>
                <div className="flex-1">
                  <div className="font-mono text-sm font-bold group-hover:text-[var(--accent-primary)]">
                    Instagram
                  </div>
                  <div className="font-mono text-xs text-[var(--text-muted)]">
                    @vulnerablepie2.0
                  </div>
                </div>
                <span className="text-xs text-[var(--text-muted)] group-hover:text-[var(--accent-primary)]">
                  →
                </span>
              </a>
            </div>

            <div className="mt-6 border-t border-[var(--border-color)] pt-4">
              <p className="text-center font-mono text-xs text-[var(--text-muted)]">
                Let&apos;s connect and build something cool!
              </p>
            </div>
          </div>

          {/* Cow Card */}
          <AmongUsCard />
        </div>
      </div>
    </div>
  );
}
