import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { STRIPE_PRICE_IDS, isSubscription } from '@/lib/stripe';

// Initialize Stripe lazily to avoid build errors if env vars are missing
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is missing. Please set it in your environment variables.');
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2025-12-15.clover',
    });
};

export async function POST(request: NextRequest) {
    try {
        const stripe = getStripe();
        const { planId, mode } = await request.json();

        if (!planId) {
            return NextResponse.json(
                { message: 'Plan ID is required' },
                { status: 400 }
            );
        }

        // Get the price ID from our mapping
        const priceId = STRIPE_PRICE_IDS[planId as keyof typeof STRIPE_PRICE_IDS];
        if (!priceId || priceId.includes('placeholder')) {
            return NextResponse.json(
                { message: 'Invalid plan or Stripe not configured. Please set up Stripe Price IDs.' },
                { status: 400 }
            );
        }

        // Determine checkout mode based on plan type
        const checkoutMode = isSubscription(planId) ? 'subscription' : 'payment';

        // Get the origin for redirect URLs
        const origin = request.headers.get('origin') || 'http://localhost:3000';

        // Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: checkoutMode,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${origin}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/shop/cancel`,
            // Enable Apple Pay and Google Pay automatically through Link
            payment_method_options: {
                card: {
                    setup_future_usage: checkoutMode === 'subscription' ? 'off_session' : undefined,
                },
            },
            // Allow promotion codes
            allow_promotion_codes: true,
            // Collect billing address for tax purposes
            billing_address_collection: 'auto',
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Checkout error:', error);
        
        if (error instanceof Stripe.errors.StripeError) {
            return NextResponse.json(
                { message: error.message },
                { status: error.statusCode || 500 }
            );
        }

        return NextResponse.json(
            { message: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}
