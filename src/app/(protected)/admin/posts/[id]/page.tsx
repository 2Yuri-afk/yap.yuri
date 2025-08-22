import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error) notFound();

  async function updatePost(formData: FormData) {
    'use server';
    const supabase = await createSupabaseServerClient();
    const title = String(formData.get('title') || '');
    const status = String(formData.get('status') || 'draft') as
      | 'draft'
      | 'published'
      | 'scheduled';
    const excerpt = String(formData.get('excerpt') || '');

    const { error } = await supabase
      .from('posts')
      .update({ title, status, excerpt })
      .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/posts');
  }

  async function deletePost() {
    'use server';
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from('posts').delete().eq('id', id);
    if (error) throw new Error(error.message);
    revalidatePath('/admin/posts');
    redirect('/admin/posts');
  }

  return (
    <div className="grid max-w-2xl gap-6">
      <div className="card-8bit p-6">
        <form action={updatePost} className="grid gap-4">
          <h2 className="font-mono">Edit Post</h2>
          <label className="font-mono text-sm">Title</label>
          <input
            className="input-8bit px-3 py-2"
            name="title"
            defaultValue={post!.title}
            required
          />
          <label className="font-mono text-sm">Excerpt</label>
          <textarea
            className="input-8bit px-3 py-2"
            name="excerpt"
            defaultValue={post!.excerpt || ''}
          />
          <label className="font-mono text-sm">Status</label>
          <select
            className="input-8bit px-3 py-2"
            name="status"
            defaultValue={post!.status}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="scheduled">scheduled</option>
          </select>
          <button className="btn-8bit" type="submit">
            Save
          </button>
        </form>

        <form action={deletePost} className="mt-4">
          <button
            className="btn-8bit bg-[var(--nord11)] text-white"
            type="submit"
          >
            Delete Post
          </button>
        </form>
      </div>

      <Link className="btn-8bit w-fit px-3 py-2" href="/admin/posts">
        Back to Posts
      </Link>
    </div>
  );
}
