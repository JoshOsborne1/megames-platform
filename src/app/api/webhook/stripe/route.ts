import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe lazily
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is missing. Please set it in your environment variables.');
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-12-15.clover',
    });
};

// Initialize Supabase with service role - REQUIRED for webhook operations
const getSupabase = () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl) {
        throw new Error('NEXT_PUBLIC_SUPABASE_URL must be defined');
    }

    if (!supabaseServiceKey) {
        throw new Error('SUPABASE_SERVICE_ROLE_KEY must be defined for webhook operations');
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
};

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
        return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
        const stripe = getStripe();
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
        console.error('Webhook signature verification failed:', err);
        return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    try {
        switch (event.type) {
            case 'checkout.session.completed': {
                const session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutComplete(session);
                break;
            }

            case 'customer.subscription.created':
            case 'customer.subscription.updated': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionUpdate(subscription);
                break;
            }

            case 'customer.subscription.deleted': {
                const subscription = event.data.object as Stripe.Subscription;
                await handleSubscriptionDeleted(subscription);
                break;
            }

            case 'invoice.payment_succeeded': {
                const invoice = event.data.object as Stripe.Invoice;
                console.log('Payment succeeded for invoice:', invoice.id);
                break;
            }

            case 'invoice.payment_failed': {
                const invoice = event.data.object as Stripe.Invoice;
                console.warn('Payment failed for invoice:', invoice.id);
                // Could notify user here
                break;
            }

            default:
                console.log(`Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error('Webhook handler error:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
    const customerId = session.customer as string;
    const customerEmail = session.customer_email || session.customer_details?.email;
    const userId = session.metadata?.user_id; // Linked from checkout API

    console.log('Checkout completed:', {
        sessionId: session.id,
        customerId,
        customerEmail,
        userId,
        mode: session.mode,
    });

    // For one-time payments (day passes)
    if (session.mode === 'payment' && session.payment_intent) {
        const stripe = getStripe();
        const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
        
        // Extract plan ID from metadata or line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const priceId = lineItems.data[0]?.price?.id;
        
        // Determine pass type from price ID
        let passId = 'partypack_standard'; // default
        if (priceId?.includes('party')) {
            passId = 'partypack_party';
        }

        // Calculate expiry (24 hours from now)
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24);

        const supabase = getSupabase();
        await supabase.from('one_time_purchases').insert({
            user_id: userId || null,
            stripe_payment_intent_id: paymentIntent.id,
            stripe_customer_id: customerId,
            customer_email: customerEmail,
            pass_id: passId,
            expires_at: expiresAt.toISOString(),
        });

        console.log('One-time purchase recorded:', passId);
    }

    // Subscriptions are handled by the subscription.created event
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
    const stripe = getStripe();
    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price?.id;
    
    // Fetch customer to get email
    const customer = await stripe.customers.retrieve(customerId);
    const customerEmail = (customer as Stripe.Customer).email;
    
    // Determine plan type from price ID
    let planId = 'partypro_monthly'; // default
    if (priceId?.includes('weekly')) {
        planId = 'partypro_weekly';
    } else if (priceId?.includes('yearly')) {
        planId = 'partypro_yearly';
    }

    const currentPeriodEnd = new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000);

    const subscriptionData = {
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        customer_email: customerEmail,
        status: subscription.status,
        plan_id: planId,
        current_period_end: currentPeriodEnd.toISOString(),
    };

    // Upsert subscription record
    const supabase = getSupabase();
    const { error: subError } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData, {
            onConflict: 'stripe_subscription_id',
        });

    if (subError) {
        console.error('Failed to update subscription:', subError);
        throw subError;
    }

    // Update user profile is_pro status if we have their email
    if (customerEmail && subscription.status === 'active') {
        // First find the user by email
        const { data: authUsers } = await supabase.auth.admin.listUsers();
        const user = authUsers?.users.find(u => u.email === customerEmail);
        
        if (user) {
            // Map planId to pro_tier
            const proTier = planId.replace('partypro_', ''); // weekly, monthly, yearly
            
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    is_pro: true,
                    pro_tier: proTier,
                    pro_expires_at: currentPeriodEnd.toISOString(),
                })
                .eq('id', user.id);

            if (profileError) {
                console.error('Failed to update profile is_pro:', profileError);
            } else {
                console.log('Updated profile is_pro for user:', user.id);
            }
        }
    }

    console.log('Subscription updated:', subscription.id, subscription.status);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const stripe = getStripe();
    const customerId = subscription.customer as string;
    
    // Fetch customer to get email
    const customer = await stripe.customers.retrieve(customerId);
    const customerEmail = (customer as Stripe.Customer).email;

    const supabase = getSupabase();
    const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id);

    if (error) {
        console.error('Failed to update canceled subscription:', error);
        throw error;
    }

    // Update user profile to remove pro status
    if (customerEmail) {
        const { data: authUsers } = await supabase.auth.admin.listUsers();
        const user = authUsers?.users.find(u => u.email === customerEmail);
        
        if (user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .update({
                    is_pro: false,
                    pro_tier: null,
                    pro_expires_at: null,
                })
                .eq('id', user.id);

            if (profileError) {
                console.error('Failed to update profile is_pro:', profileError);
            } else {
                console.log('Removed pro status for user:', user.id);
            }
        }
    }

    console.log('Subscription canceled:', subscription.id);
}
