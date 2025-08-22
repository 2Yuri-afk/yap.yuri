import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { rateLimitLogin } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const email = String(formData.get('email') || '');
  const password = String(formData.get('password') || '');

  // Rate limit based on IP and email combination
  const ip =
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const rateLimitKey = `${ip}:${email}`;

  const rateLimitResult = await rateLimitLogin(rateLimitKey);
  if (!rateLimitResult.success) {
    const search = new URLSearchParams({
      error: `Too many login attempts. Please try again in ${Math.ceil((rateLimitResult.retryAfter || 1800) / 60)} minutes.`,
    });
    return NextResponse.redirect(
      new URL(`/admin/login?${search.toString()}`, req.url)
    );
  }

  const supabase = await createSupabaseServerClient('action');

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const search = new URLSearchParams({ error: error.message });
    return NextResponse.redirect(
      new URL(`/admin/login?${search.toString()}`, req.url)
    );
  }

  return NextResponse.redirect(new URL('/admin', req.url));
}
