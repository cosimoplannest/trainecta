
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.6";

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  userId: string;
  title: string;
  message: string;
  type?: 'app' | 'email' | 'both';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, title, message, type = 'app' } = await req.json() as NotificationRequest;

    if (!userId || !title || !message) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: userId, title, message" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Create notification using RPC function
    const { data, error } = await supabase.rpc('create_notification', {
      p_user_id: userId,
      p_title: title,
      p_message: message,
      p_notification_type: type
    });

    if (error) throw error;

    // If notification type includes email, send email
    if (type === 'email' || type === 'both') {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('id', userId)
        .single();

      if (userError) throw userError;

      // Call email function
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-notification-email', {
        body: {
          to: userData.email,
          title,
          message,
          notificationId: data
        }
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        // Continue execution even if email fails
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Notification created successfully", 
        notificationId: data 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error creating notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
