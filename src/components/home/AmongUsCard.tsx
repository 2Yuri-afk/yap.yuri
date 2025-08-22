export default function AmongUsCard() {
  return (
    <div className="pixel-card-elevated p-4 lg:p-5">
      {/* Cow ASCII Art */}
      <div className="py-5">
        <div className="flex items-center justify-center gap-4">
          <span className="font-mono text-sm text-[var(--text-muted)]">
            Moo?
          </span>
          <pre
            className="text-sm leading-relaxed text-[var(--text-muted)]"
            style={{ fontFamily: 'monospace' }}
          >
            {`         (__)
         (oo)
   /------\\/
  / |    ||
 *  /\\---/\\
    ~~   ~~`}
          </pre>
        </div>
      </div>
    </div>
  );
}
