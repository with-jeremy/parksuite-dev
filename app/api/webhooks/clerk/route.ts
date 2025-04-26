import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { WebhookEvent } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';
import { db } from '@/utils/supabase/client';
import { TablesInsert } from '@/types/supabase';

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);
    
    const eventType = evt.type;
    console.log(`Received webhook with ID ${evt.data.id} and event type of ${eventType}`);
    
    // Handle the different event types
    if (eventType === 'user.created') {
      const { id, email_addresses, image_url, first_name, last_name, phone_numbers } = evt.data;
      
      // Create a new user entry in Supabase
      // Handle both email and OAuth sign-ups
      const primaryEmail = email_addresses?.length > 0 
        ? email_addresses[0].email_address
        : null;
      
      const primaryPhone = phone_numbers?.length > 0
        ? phone_numbers[0].phone_number
        : null;

      if (!primaryEmail) {
        console.error('No email found for user', id);
        return new Response('Error: No email found', { status: 400 });
      }

      // Check if user already exists in Supabase (could happen with social logins)
      const { data: existingUser } = await db
        .from("users")
        .select()
        .eq("id", id)
        .single();

      if (existingUser) {
        console.log(`User ${id} already exists in Supabase`);
        return new Response(JSON.stringify({ success: true, message: 'User already exists' }), {
          headers: { 'Content-Type': 'application/json' }
        });
      }

      // Extract avatar URL from OAuth or Clerk
      let avatarUrl = image_url;
      
      // If the user signed up with OAuth, they might have a profile picture from the provider
      const externalAccount = evt.data.external_accounts?.[0];
      const oauthAvatarUrl = externalAccount 
        ? (externalAccount as any).avatar_url 
        : null;
      
      if (oauthAvatarUrl) {
        avatarUrl = oauthAvatarUrl;
      }

      const newUser: TablesInsert<"users"> = {
        id: id,
        email: primaryEmail,
        avatar_url: avatarUrl || null,
        first_name: first_name || null,
        last_name: last_name || null,
        phone: primaryPhone || null,
        is_host: false,
        is_admin: false
      };

      const { error } = await db.from("users").insert([newUser]);

      if (error) {
        console.error('Error inserting user into Supabase:', error);
        return new Response(JSON.stringify({ error: 'Error inserting user' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    else if (eventType === 'user.updated') {
      const { id, email_addresses, image_url, first_name, last_name, phone_numbers, external_accounts } = evt.data;
      
      const primaryEmail = email_addresses?.length > 0
        ? email_addresses[0].email_address
        : null;
      
      const primaryPhone = phone_numbers?.length > 0
        ? phone_numbers[0].phone_number
        : null;

      if (!primaryEmail) {
        return new Response('Error: No email found', { status: 400 });
      }

      // Extract avatar URL from OAuth or Clerk
      let avatarUrl = image_url;
      
      // If the user signed in with OAuth, they might have updated their profile picture on the provider
      const externalAccount = external_accounts?.[0];
      const oauthAvatarUrl = externalAccount 
        ? (externalAccount as any).avatar_url 
        : null;
      
      if (oauthAvatarUrl) {
        avatarUrl = oauthAvatarUrl;
      }

      const updates = {
        email: primaryEmail,
        avatar_url: avatarUrl || null,
        first_name: first_name || null,
        last_name: last_name || null,
        phone: primaryPhone || null
      };

      const { error } = await db
        .from("users")
        .update(updates)
        .eq("id", id);

      if (error) {
        console.error('Error updating user in Supabase:', error);
        return new Response(JSON.stringify({ error: 'Error updating user' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
    
    else if (eventType === 'user.deleted') {
      const { id } = evt.data;
      
      const { error } = await db
        .from("users")
        .delete()
        .eq("id", id);

      if (error) {
        console.error('Error deleting user from Supabase:', error);
        return new Response(JSON.stringify({ error: 'Error deleting user' }), { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}