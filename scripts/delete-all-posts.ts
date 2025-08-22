import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables');
  console.error(
    'Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function deleteAllPosts() {
  console.log('🗑️  Starting to delete all posts...\n');

  try {
    // First, let's see how many posts we have
    const { data: posts, error: countError } = await supabase
      .from('posts')
      .select('id, title, post_type, status');

    if (countError) {
      console.error('❌ Error fetching posts:', countError);
      return;
    }

    if (!posts || posts.length === 0) {
      console.log('ℹ️  No posts found in the database.');
      return;
    }

    console.log(`Found ${posts.length} posts to delete:\n`);

    // Display the posts that will be deleted
    posts.forEach((post, index) => {
      console.log(
        `  ${index + 1}. [${post.post_type}] ${post.title} (${post.status})`
      );
    });

    console.log('\n⚠️  WARNING: This will permanently delete ALL posts!');
    console.log('Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

    // Give user time to cancel
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Delete all posts
    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // This condition ensures we delete all records

    if (deleteError) {
      console.error('❌ Error deleting posts:', deleteError);
      return;
    }

    console.log('✅ Successfully deleted all posts!');
    console.log('\n🎮 Your blog is now clean and ready for real content!');
    console.log('Go to /admin to start creating your posts.\n');
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the deletion
deleteAllPosts();
