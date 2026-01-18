/**
 * Stripe Client Configuration
 * 
 * Client-side Stripe utilities for payment processing
 */
import { loadStripe, Stripe } from '@stripe/stripe-js';

// Lazy-loaded Stripe instance (only loads when needed)
let stripePromise: Promise<Stripe | null>;

/**
 * Get the Stripe instance for client-side operations
 */
export const getStripe = () => {
    if (!stripePromise) {
        const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (!key) {
            console.warn('Stripe publishable key not configured');
            return Promise.resolve(null);
        }
        stripePromise = loadStripe(key);
    }
    return stripePromise;
};

/**
 * Stripe Product IDs - must match products created in Stripe Dashboard
 * These will be replaced with actual Stripe Price IDs after setup
 */
export const STRIPE_PRICE_IDS = {
    // Subscriptions (PartyPro)
    partypro_weekly: process.env.NEXT_PUBLIC_STRIPE_PRICE_WEEKLY || 'price_weekly_placeholder',
    partypro_monthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || 'price_monthly_placeholder',
    partypro_yearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_YEARLY || 'price_yearly_placeholder',
    // One-time passes (PartyPack)
    partypack_standard: process.env.NEXT_PUBLIC_STRIPE_PRICE_STANDARD || 'price_standard_placeholder',
    partypack_party: process.env.NEXT_PUBLIC_STRIPE_PRICE_PARTY || 'price_party_placeholder',
} as const;

export type StripePriceId = keyof typeof STRIPE_PRICE_IDS;

/**
 * Redirect to Stripe Checkout for a subscription or one-time purchase
 */
export async function redirectToCheckout(planId: string, mode: 'subscription' | 'payment' = 'subscription') {
    // Call our API to create a checkout session
    const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, mode }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create checkout session');
    }

    const { url } = await response.json();

    // Redirect to Stripe Checkout URL
    if (url) {
        window.location.href = url;
    } else {
        throw new Error('No checkout URL returned');
    }
}

/**
 * Check if a plan ID is a subscription or one-time purchase
 */
export function isSubscription(planId: string): boolean {
    return planId.startsWith('partypro_');
}
