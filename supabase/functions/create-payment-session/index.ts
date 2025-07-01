
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;
    
    if (!user?.email) {
      throw new Error("User not authenticated");
    }

    const { orderData } = await req.json();
    console.log('Creating payment session for order:', orderData);

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2023-10-16",
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: orderData.items.map((item: any) => ({
        price_data: {
          currency: 'egp',
          product_data: {
            name: item.name,
            description: item.description,
          },
          unit_amount: Math.round(item.price * 100), // Convert to piasters
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${req.headers.get("origin")}/orders?success=true`,
      cancel_url: `${req.headers.get("origin")}/checkout?canceled=true`,
      customer_email: user.email,
      metadata: {
        user_id: user.id,
        order_data: JSON.stringify(orderData)
      }
    });

    // Create order in database
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: user.id,
        total_amount: orderData.total,
        currency: 'EGP',
        shipping_address: orderData.shipping_address,
        phone: orderData.phone,
        notes: orderData.notes || null,
        status: 'pending',
        payment_status: 'pending',
        stripe_session_id: session.id
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Create order items
    const orderItems = orderData.items.map((item: any) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
      currency: 'EGP'
    }));

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return new Response(JSON.stringify({ 
      sessionId: session.id,
      url: session.url 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error('Payment session error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
