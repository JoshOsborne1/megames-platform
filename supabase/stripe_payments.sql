-- Stripe Payment System Migration
-- Run this in Supabase SQL Editor

-- Subscriptions table for recurring payments
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT UNIQUE NOT NULL,
    customer_email TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- active, canceled, past_due, trialing
    plan_id TEXT NOT NULL, -- partypro_weekly, partypro_monthly, partypro_yearly
    current_period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- One-time purchases table for day passes
CREATE TABLE IF NOT EXISTS one_time_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    customer_email TEXT,
    pass_id TEXT NOT NULL, -- partypack_standard, partypack_party
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_subscriptions_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(customer_email);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_customer_id ON one_time_purchases(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_email ON one_time_purchases(customer_email);
CREATE INDEX IF NOT EXISTS idx_one_time_purchases_expires_at ON one_time_purchases(expires_at);

-- Enable Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE one_time_purchases ENABLE ROW LEVEL SECURITY;

-- RLS Policies for subscriptions
CREATE POLICY "Users can view own subscriptions" ON subscriptions
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = customer_email
    );

CREATE POLICY "Service role can manage subscriptions" ON subscriptions
    FOR ALL USING (auth.role() = 'service_role');

-- RLS Policies for one_time_purchases
CREATE POLICY "Users can view own purchases" ON one_time_purchases
    FOR SELECT USING (
        auth.uid() = user_id OR 
        auth.jwt() ->> 'email' = customer_email
    );

CREATE POLICY "Service role can manage purchases" ON one_time_purchases
    FOR ALL USING (auth.role() = 'service_role');

-- Function to check if user has active subscription
CREATE OR REPLACE FUNCTION has_active_subscription(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM subscriptions 
        WHERE customer_email = email 
        AND status = 'active' 
        AND current_period_end > NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has active day pass
CREATE OR REPLACE FUNCTION has_active_pass(email TEXT)
RETURNS TEXT AS $$
DECLARE
    pass_record RECORD;
BEGIN
    SELECT pass_id INTO pass_record 
    FROM one_time_purchases 
    WHERE customer_email = email 
    AND expires_at > NOW()
    ORDER BY expires_at DESC
    LIMIT 1;
    
    IF FOUND THEN
        RETURN pass_record.pass_id;
    ELSE
        RETURN NULL;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's subscription tier
CREATE OR REPLACE FUNCTION get_subscription_tier(email TEXT)
RETURNS TEXT AS $$
DECLARE
    sub_record RECORD;
    pass_id TEXT;
BEGIN
    -- Check for active subscription first
    SELECT plan_id INTO sub_record
    FROM subscriptions
    WHERE customer_email = email
    AND status = 'active'
    AND current_period_end > NOW()
    LIMIT 1;
    
    IF FOUND THEN
        RETURN 'partypro';
    END IF;
    
    -- Then check for active day pass
    pass_id := has_active_pass(email);
    IF pass_id IS NOT NULL THEN
        IF pass_id = 'partypack_party' THEN
            RETURN 'party';
        ELSE
            RETURN 'standard';
        END IF;
    END IF;
    
    -- Default to free tier
    RETURN 'free';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
