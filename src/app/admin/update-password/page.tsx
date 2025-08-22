'use client';

import { useState, useEffect } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if there's a session (user came from reset link)
    const checkSession = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setMessage({
          type: 'error',
          text: 'Invalid or expired reset link. Please request a new one.',
        });
      }
    };
    
    checkSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (password !== confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match.',
      });
      return;
    }
    
    if (password.length < 6) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 6 characters long.',
      });
      return;
    }
    
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setMessage({
          type: 'error',
          text: error.message,
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Password updated successfully! Redirecting to login...',
        });
        
        // Sign out and redirect to login
        setTimeout(async () => {
          await supabase.auth.signOut();
          router.push('/admin/login');
        }, 2000);
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
            Set New Password
          </h1>
          <p className="font-mono text-xs text-[var(--text-muted)]">
            Choose a strong password for your account
          </p>
        </div>

        {/* Update Form */}
        <form
          className="border-2 border-[var(--border-color)] bg-[var(--bg-secondary)] p-8"
          onSubmit={handleUpdatePassword}
        >
          <div className="space-y-4">
            {/* New Password Field */}
            <div className="space-y-2">
              <label
                className="font-mono text-sm text-[var(--text-primary)]"
                htmlFor="password"
              >
                New Password
              </label>
              <input
                className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2 font-mono text-sm transition-all focus:border-[var(--accent-primary)] focus:outline-none"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
              />
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label
                className="font-mono text-sm text-[var(--text-primary)]"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                className="w-full border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2 font-mono text-sm transition-all focus:border-[var(--accent-primary)] focus:outline-none"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                minLength={6}
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
              {loading ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>

        {/* Footer text */}
        <div className="mt-6 text-center">
          <p className="font-mono text-xs text-[var(--text-muted)]">
            Password must be at least 6 characters
          </p>
        </div>
      </div>
    </div>
  );
}
