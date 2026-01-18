"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { getLimits, SubscriptionTier, GameLimits } from '@/lib/subscription';

interface SubscriptionStatus {
    tier: SubscriptionTier;
    limits: GameLimits;
    isLoading: boolean;
    error: string | null;
    isActive: boolean;
    expiresAt: Date | null;
    refresh: () => Promise<void>;
}

/**
 * Hook to get the current user's subscription status and game limits
 */
export function useSubscription(): SubscriptionStatus {
    const [tier, setTier] = useState<SubscriptionTier>('free');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expiresAt, setExpiresAt] = useState<Date | null>(null);

    const fetchSubscriptionStatus = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user?.email) {
                // No authenticated user - default to free tier
                setTier('free');
                setExpiresAt(null);
                setIsLoading(false);
                return;
            }

            // Check for active subscription
            const { data: subscription } = await supabase
                .from('subscriptions')
                .select('*')
                .eq('customer_email', user.email)
                .eq('status', 'active')
                .gte('current_period_end', new Date().toISOString())
                .order('current_period_end', { ascending: false })
                .limit(1)
                .single();

            if (subscription) {
                setTier('partypro');
                setExpiresAt(new Date(subscription.current_period_end));
                setIsLoading(false);
                return;
            }

            // Check for active day pass
            const { data: dayPass } = await supabase
                .from('one_time_purchases')
                .select('*')
                .eq('customer_email', user.email)
                .gte('expires_at', new Date().toISOString())
                .order('expires_at', { ascending: false })
                .limit(1)
                .single();

            if (dayPass) {
                const passTier = dayPass.pass_id === 'partypack_party' ? 'party' : 'standard';
                setTier(passTier);
                setExpiresAt(new Date(dayPass.expires_at));
                setIsLoading(false);
                return;
            }

            // Default to free tier
            setTier('free');
            setExpiresAt(null);
        } catch (err) {
            // If tables don't exist yet, default to free
            console.log('Subscription check:', err);
            setTier('free');
            setExpiresAt(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSubscriptionStatus();
    }, [fetchSubscriptionStatus]);

    return {
        tier,
        limits: getLimits(tier),
        isLoading,
        error,
        isActive: tier !== 'free',
        expiresAt,
        refresh: fetchSubscriptionStatus,
    };
}

/**
 * Check if a specific feature limit is exceeded
 */
export function useFeatureLimit(limitKey: keyof GameLimits, currentValue: number) {
    const { limits, isLoading, tier } = useSubscription();
    const limit = limits[limitKey];
    const isExceeded = typeof limit === 'number' && currentValue >= limit;
    const remaining = typeof limit === 'number' ? Math.max(0, limit - currentValue) : Infinity;

    return {
        limit,
        isExceeded,
        remaining,
        tier,
        isLoading,
    };
}
