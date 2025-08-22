import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-secondary)] to-[var(--bg-tertiary)]">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, 
                var(--border-color) 0, 
                transparent 1px, 
                transparent 40px, 
                var(--border-color) 41px),
              repeating-linear-gradient(90deg, 
                var(--border-color) 0, 
                transparent 1px, 
                transparent 40px, 
                var(--border-color) 41px)
            `,
          }}
        />
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Glitch effect title */}
        <h1
          className="glitch mb-6 text-4xl md:text-6xl"
          data-text="HELLO WORLD"
          style={{ fontFamily: 'Press Start 2P, monospace' }}
        >
          HELLO WORLD
        </h1>

        {/* Subtitle with typing animation */}
        <div className="terminal mb-8 inline-block">
          <div className="terminal-header px-4 py-2">
            <span className="terminal-dot"></span>
            <span className="terminal-dot yellow ml-2"></span>
            <span className="terminal-dot green ml-2"></span>
          </div>
          <div className="terminal-body text-left">
            <p className="text-sm md:text-base">
              <span className="text-[var(--text-muted)]">$</span> whoami
            </p>
            <p className="mt-2 text-sm md:text-base">
              Developer, Creator, 8-bit Enthusiast
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/blog" className="btn-pixel">
            Read Blog
          </Link>
          <Link href="/blog?type=project" className="btn-pixel btn-secondary">
            View Projects
          </Link>
          <Link
            href="/about"
            className="btn-pixel"
            style={{ background: 'var(--accent-special)' }}
          >
            About Me
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 transform animate-bounce">
          <div className="flex h-10 w-6 justify-center border-2 border-[var(--accent-primary)]">
            <div className="mt-2 h-3 w-1 animate-pulse bg-[var(--accent-primary)]"></div>
          </div>
        </div>
      </div>

      {/* Floating pixels decoration */}
      <div className="absolute top-10 left-10 h-4 w-4 bg-[var(--nord14)]"></div>
      <div className="absolute top-20 right-20 h-4 w-4 bg-[var(--nord13)]"></div>
      <div className="absolute bottom-20 left-20 h-4 w-4 bg-[var(--nord15)]"></div>
      <div className="absolute right-10 bottom-10 h-4 w-4 bg-[var(--nord12)]"></div>
    </section>
  );
}
