import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import AdminWrapper from '@/components/admin/AdminWrapper';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  return <AdminWrapper user={user}>{children}</AdminWrapper>;
}
