import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { CookieOptions } from '@supabase/ssr';

export async function createSupabaseServerClient(
  componentType: 'page' | 'action' = 'page'
) {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          // Only set cookies in server actions or route handlers
          if (componentType === 'action') {
            cookieStore.set({ name, value, ...options });
          }
        },
        remove(name: string, options: CookieOptions) {
          // Only remove cookies in server actions or route handlers
          if (componentType === 'action') {
            cookieStore.set({ name, value: '', ...options });
          }
        },
      },
    }
  );
}
