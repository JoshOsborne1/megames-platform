"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { useSubscription } from "@/hooks/useSubscription";
import { SUBSCRIPTION_PLANS, ONE_TIME_PASSES } from "@/lib/subscription";
import { createClient } from "@/lib/supabase/client";
import { 
    Crown, ArrowLeft, Calendar, CreditCard, Loader2, 
    CheckCircle, XCircle, RefreshCw, ExternalLink
} from "lucide-react";
import Link from "next/link";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function ManageSubscriptionPage() {
    const router = useRouter();
    const { tier, isLoading, expiresAt, refresh } = useSubscription();
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }: { data: { user: SupabaseUser | null } }) => {
            setUser(user);
            setLoading(false);
            if (!user) {
                router.push("/profile");
            }
        });
    }, [router]);

    const handleRefresh = async () => {
        setRefreshing(true);
        await refresh();
        setRefreshing(false);
    };

    // Find the plan details
    const currentPlan = tier === 'partypro' 
        ? SUBSCRIPTION_PLANS.find(p => p.id.includes(tier)) 
        : ONE_TIME_PASSES.find(p => p.id.includes(tier)) || null;

    if (loading || isLoading) {
        return (
            <AppShell>
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#00f5ff]" />
                </div>
            </AppShell>
        );
    }

    return (
        <AppShell>
            <div className="min-h-screen pb-24 px-4 pt-6 max-w-md mx-auto">
                {/* Back Button */}
                <Link href="/shop" className="flex items-center gap-2 text-white/50 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Back to Shop</span>
                </Link>

                {/* Header */}
                <header className="text-center mb-8">
                    <h1 className="font-display font-bold text-xl uppercase tracking-wider text-white">
                        Manage Subscription
                    </h1>
                    <p className="text-xs text-white/50 font-medium">
                        View and manage your plan
                    </p>
                </header>

                {/* Current Plan Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-6 relative overflow-hidden"
                >
                    {/* Glow effect for pro */}
                    {tier !== 'free' && (
                        <>
                            <div className="absolute -top-16 -right-16 w-32 h-32 bg-amber-400/20 blur-3xl rounded-full" />
                            <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#8338ec]/20 blur-3xl rounded-full" />
                        </>
                    )}

                    <div className="relative z-10">
                        {/* Status Badge */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                {tier !== 'free' ? (
                                    <>
                                        <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center">
                                            <Crown className="w-5 h-5 text-amber-400" />
                                        </div>
                                        <div>
                                            <h2 className="font-display font-bold text-lg text-white capitalize">
                                                {tier === 'partypro' ? 'PartyPro' : tier === 'party' ? 'PartyPack Party' : 'PartyPack Standard'}
                                            </h2>
                                            <div className="flex items-center gap-1.5">
                                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                                <span className="text-xs text-emerald-400 font-medium">Active</span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                            <XCircle className="w-5 h-5 text-white/40" />
                                        </div>
                                        <div>
                                            <h2 className="font-display font-bold text-lg text-white">Free Tier</h2>
                                            <span className="text-xs text-white/40">Limited access</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={handleRefresh}
                                disabled={refreshing}
                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                            >
                                <RefreshCw className={`w-4 h-4 text-white/40 ${refreshing ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Expiration */}
                        {expiresAt && (
                            <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
                                <Calendar className="w-4 h-4 text-white/40" />
                                <span className="text-sm text-white/70">
                                    {tier === 'partypro' ? 'Renews' : 'Expires'}: {' '}
                                    <span className="text-white font-medium">
                                        {expiresAt.toLocaleDateString('en-GB', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </span>
                            </div>
                        )}

                        {/* Features Preview */}
                        {currentPlan && (
                            <div className="space-y-2 mb-4">
                                <p className="text-xs text-white/40 uppercase tracking-wider">Included Features</p>
                                <ul className="space-y-1.5">
                                    {currentPlan.features.slice(0, 4).map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-white/70">
                                            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Actions */}
                        {tier === 'free' ? (
                            <Link href="/shop">
                                <motion.button
                                    whileTap={{ scale: 0.98 }}
                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00f5ff] to-[#00d4e0] text-black font-bold"
                                >
                                    Upgrade Now
                                </motion.button>
                            </Link>
                        ) : tier === 'partypro' ? (
                            <a
                                href="https://billing.stripe.com/p/login/test_aEU5mP7cO92j2VG7ss"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
                            >
                                <CreditCard className="w-4 h-4" />
                                Manage Billing
                                <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                        ) : (
                            <p className="text-center text-white/40 text-sm">
                                Day passes are one-time purchases and cannot be cancelled.
                            </p>
                        )}
                    </div>
                </motion.div>

                {/* Upgrade Options (for non-pro users) */}
                {tier !== 'partypro' && (
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="p-4 rounded-xl bg-gradient-to-br from-amber-400/10 to-orange-500/10 border border-amber-400/20"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <Crown className="w-5 h-5 text-amber-400" />
                            <h3 className="font-bold text-white">Upgrade to PartyPro</h3>
                        </div>
                        <p className="text-sm text-white/60 mb-3">
                            Get unlimited access to all games and features with our subscription plans.
                        </p>
                        <Link href="/shop">
                            <button className="text-sm text-amber-400 font-medium hover:underline">
                                View Plans →
                            </button>
                        </Link>
                    </motion.div>
                )}

                {/* Account Info */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10"
                >
                    <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Account</p>
                    <p className="text-sm text-white">{user?.email}</p>
                </motion.div>
            </div>
        </AppShell>
    );
}
