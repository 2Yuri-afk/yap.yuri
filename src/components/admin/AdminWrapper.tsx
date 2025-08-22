'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface AdminWrapperProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
  children: ReactNode;
}

export default function AdminWrapper({ user, children }: AdminWrapperProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard' },
    { href: '/admin/posts', label: 'Posts' },
    { href: '/admin/posts/new', label: 'New Post' },
    { href: '/admin/settings', label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)]">
      {/* Sidebar - Static with flex layout */}
      <aside className="w-64 border-r-2 border-[var(--border-color)] bg-[var(--bg-secondary)] flex flex-col">
        {/* Sidebar Header */}
        <div className="border-b border-[var(--border-color)] p-6">
          <h1
            className="text-lg text-[var(--accent-primary)]"
            style={{ fontFamily: 'Press Start 2P, monospace' }}
          >
            Admin Panel
          </h1>

          {/* User Info */}
          <div className="mt-4">
            <div className="font-mono text-xs text-[var(--text-muted)]">
              Logged in as:
            </div>
            <div className="truncate font-mono text-xs text-[var(--text-primary)]">
              {user?.email || 'admin@site.com'}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map(item => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`block p-3 font-mono text-sm transition-all ${
                      isActive
                        ? 'bg-[var(--accent-primary)] text-white'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer - Spacer */}
        <div className="flex-1" />
        
        {/* Sign Out Button - At bottom of sidebar */}
        <div className="border-t border-[var(--border-color)] p-4">
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="w-full px-4 py-2 border-2 border-[var(--border-color)] bg-[var(--bg-primary)] font-mono text-sm text-[var(--text-primary)] transition-all hover:border-[var(--nord11)] hover:bg-[var(--nord11)] hover:text-white"
            >
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {/* Top Bar */}
        <header className="border-b border-[var(--border-color)] bg-[var(--bg-secondary)] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 font-mono text-sm">
                <Link
                  href="/"
                  target="_blank"
                  className="text-[var(--text-muted)] transition-colors hover:text-[var(--accent-primary)]"
                >
                  yap.yuri
                </Link>
                <span className="text-[var(--text-muted)]">/</span>
                <span className="text-[var(--text-primary)]">
                  {pathname.split('/').pop() || 'admin'}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {/* View Site Button */}
              <Link
                href="/"
                target="_blank"
                className="bg-[var(--bg-tertiary)] px-3 py-2 font-mono text-sm text-[var(--text-primary)] transition-all hover:bg-[var(--accent-primary)] hover:text-white"
              >
                View Site
              </Link>
            </div>
          </div>
        </header>
        {/* Page Content */}
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
