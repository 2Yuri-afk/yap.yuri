import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="mx-auto max-w-md text-center">
        <h1 className="text-primary mb-4 text-8xl font-bold">404</h1>
        <h2 className="mb-3 text-2xl font-semibold">Page not found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It
          might have been moved or deleted.
        </p>
        <div className="space-x-4">
          <Link href="/">
            <Button size="lg">
              <Home className="mr-2 h-4 w-4" />
              Go home
            </Button>
          </Link>
          <Link href="/posts">
            <Button variant="outline" size="lg">
              <Search className="mr-2 h-4 w-4" />
              Browse posts
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
