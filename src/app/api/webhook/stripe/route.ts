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

// Initialize Supabase with service role for webhook operations
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

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

    console.log('Checkout completed:', {
        sessionId: session.id,
        customerId,
        customerEmail,
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

        await supabase.from('one_time_purchases').insert({
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
    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price?.id;
    
    // Determine plan type from price ID
    let planId = 'partypro_monthly'; // default
    if (priceId?.includes('weekly')) {
        planId = 'partypro_weekly';
    } else if (priceId?.includes('yearly')) {
        planId = 'partypro_yearly';
    }

    const subscriptionData = {
        stripe_subscription_id: subscription.id,
        stripe_customer_id: customerId,
        status: subscription.status,
        plan_id: planId,
        // Access current_period_end from the subscription item
        current_period_end: new Date((subscription as unknown as { current_period_end: number }).current_period_end * 1000).toISOString(),
    };

    // Upsert subscription record
    const { error } = await supabase
        .from('subscriptions')
        .upsert(subscriptionData, {
            onConflict: 'stripe_subscription_id',
        });

    if (error) {
        console.error('Failed to update subscription:', error);
        throw error;
    }

    console.log('Subscription updated:', subscription.id, subscription.status);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const { error } = await supabase
        .from('subscriptions')
        .update({ status: 'canceled' })
        .eq('stripe_subscription_id', subscription.id);

    if (error) {
        console.error('Failed to update canceled subscription:', error);
        throw error;
    }

    console.log('Subscription canceled:', subscription.id);
}
