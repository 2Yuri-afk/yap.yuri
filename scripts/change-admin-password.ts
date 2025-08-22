#!/usr/bin/env tsx
/**
 * Script to change admin password
 * Usage: npm run change-password
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline/promises';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in environment variables');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in environment variables');
  console.log('\n📝 To use this script, you need to add your Supabase service role key to .env.local:');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here');
  console.log('\n💡 You can find this in your Supabase dashboard:');
  console.log('   1. Go to Settings > API');
  console.log('   2. Copy the "service_role" key (keep this secret!)');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function changePassword() {
  try {
    console.log('🔐 Admin Password Change Tool\n');
    
    // Create Supabase admin client
    const supabase = createClient(supabaseUrl!, supabaseServiceKey!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Get admin email
    const email = await rl.question('Enter admin email: ');
    
    // Get new password
    const password = await rl.question('Enter new password (min 6 characters): ');
    
    if (password.length < 6) {
      console.error('❌ Password must be at least 6 characters long');
      process.exit(1);
    }
    
    // Confirm password
    const confirmPassword = await rl.question('Confirm new password: ');
    
    if (password !== confirmPassword) {
      console.error('❌ Passwords do not match');
      process.exit(1);
    }

    console.log('\n🔄 Updating password...');

    // First, get the user by email
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('❌ Error fetching users:', userError.message);
      process.exit(1);
    }

    const user = userData.users.find(u => u.email === email);
    
    if (!user) {
      console.error(`❌ No user found with email: ${email}`);
      console.log('\n💡 Available admin emails:');
      userData.users.forEach(u => {
        if (u.email) console.log(`   - ${u.email}`);
      });
      process.exit(1);
    }

    // Update the user's password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      { password }
    );

    if (updateError) {
      console.error('❌ Error updating password:', updateError.message);
      process.exit(1);
    }

    console.log('✅ Password successfully updated!');
    console.log(`\n📝 You can now login with:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: [your new password]`);
    
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
changePassword();
