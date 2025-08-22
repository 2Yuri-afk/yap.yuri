import Image from 'next/image';

interface AboutCardProps {
  stats?: {
    posts: number;
    projects: number;
    announcements: number;
  };
}

export default function AboutCard({ stats }: AboutCardProps) {
  return (
    <div>
      {/* Avatar */}
      <div className="flex justify-center p-4">
        <div
          className="relative h-24 w-24 overflow-hidden border-2 border-[var(--border-color)] bg-[var(--bg-tertiary)]"
          style={{ imageRendering: 'pixelated' }}
        >
          {/* Using Next.js Image component for optimization */}
          <Image
            src="/profile.jpg" // Change to .png if you saved as PNG
            alt="Yuri's profile picture"
            width={96}
            height={96}
            className="object-cover"
            style={{ imageRendering: 'auto' }} // Or 'pixelated' for 8-bit effect
            priority
          />
        </div>
      </div>

      {/* Name and Handle */}
      <div className="px-4 text-center">
        <h2
          className="text-lg"
          style={{ fontFamily: 'Press Start 2P, monospace' }}
        >
          yuri
        </h2>
        <p className="mt-1 font-mono text-xs text-[var(--text-muted)]">
          @yap.yuri
        </p>
      </div>

      {/* Bio */}
      <div className="mt-4 border-t border-[var(--border-color)] px-4 pt-4">
        <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
          just a developer yapping about code, building random projects, and
          sharing thoughts in pixels
        </p>
      </div>

      {/* Stats */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-[var(--border-color)] p-4">
        <div className="text-center">
          <div className="text-lg font-bold text-[var(--accent-primary)]">
            {stats?.posts || 0}
          </div>
          <div className="text-xs text-[var(--text-muted)]">posts</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[var(--nord14)]">
            {stats?.projects || 0}
          </div>
          <div className="text-xs text-[var(--text-muted)]">projects</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[var(--nord13)]">
            {stats?.announcements || 0}
          </div>
          <div className="text-xs text-[var(--text-muted)]">news</div>
        </div>
      </div>
    </div>
  );
}
