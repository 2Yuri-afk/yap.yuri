import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';

export default async function AdminLoginPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect('/admin');

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] p-6">
      {/* Login Form Container */}
      <div className="w-full max-w-sm">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1
            className="mb-2 text-xl text-[var(--accent-primary)]"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            Admin Login
          </h1>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            Enter your credentials
          </p>
        </div>

        {/* Login Form */}
        <form
          className="border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] p-8"
          action="/auth/signin"
          method="post"
        >
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="font-mono text-sm text-[var(--text-primary)]"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2 font-mono text-sm transition-all focus:border-[var(--accent-primary)] focus:outline-none"
                type="email"
                id="email"
                name="email"
                placeholder="admin@example.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label
                className="font-mono text-sm text-[var(--text-primary)]"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2 font-mono text-sm transition-all focus:border-[var(--accent-primary)] focus:outline-none"
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              className="w-full bg-[var(--accent-primary)] py-2 font-mono text-white transition-all hover:bg-[var(--accent-secondary)]"
              type="submit"
            >
              Sign In
            </Button>
          </div>
        </form>

        {/* Footer text */}
        <div className="mt-6 text-center">
          <p className="font-mono text-xs text-[var(--text-muted)]">
            Protected area - Authorized users only
          </p>
        </div>
      </div>
    </div>
  );
}
