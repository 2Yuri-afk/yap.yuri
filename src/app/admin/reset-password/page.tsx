'use client';

import { useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      
      // Get the current URL for the redirect - this ensures it uses the correct domain
      const redirectTo = `${window.location.origin}/admin/update-password`;
      
      console.log('Redirect URL:', redirectTo); // Debug log
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (error) {
        setMessage({
          type: 'error',
          text: error.message,
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Password reset link sent! Check your email inbox (and spam folder).',
        });
        setEmail('');
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-primary)] p-6">
      <div className="w-full max-w-sm">
        {/* Title */}
        <div className="mb-8 text-center">
          <h1
            className="mb-2 text-xl text-[var(--accent-primary)]"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            Reset Password
          </h1>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            Enter your email to receive a reset link
          </p>
        </div>

        {/* Reset Form */}
        <form
          className="border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] p-8"
          onSubmit={handleResetPassword}
        >
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label
                className="font-mono text-sm text-[var(--text-primary)]"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2 font-mono text-sm transition-all focus:border-[var(--accent-primary)] focus:outline-none"
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>

            {/* Message Display */}
            {message && (
              <div
                className={`border px-4 py-2 font-mono text-xs ${
                  message.type === 'success'
                    ? 'border-green-500 bg-green-500/10 text-green-400'
                    : 'border-red-500 bg-red-500/10 text-red-400'
                }`}
              >
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <Button
              className="w-full bg-[var(--accent-primary)] py-2 font-mono text-white transition-all hover:bg-[var(--accent-secondary)] disabled:opacity-50"
              type="submit"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Button>

            {/* Back to Login */}
            <div className="text-center">
              <Link
                href="/admin/login"
                className="font-mono text-xs text-[var(--text-muted)] hover:text-[var(--accent-primary)]"
              >
                ← Back to login
              </Link>
            </div>
          </div>
        </form>

        {/* Footer text */}
        <div className="mt-6 text-center">
          <p className="font-mono text-xs text-[var(--text-muted)]">
            The reset link will expire in 1 hour
          </p>
        </div>
      </div>
    </div>
  );
}
