"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import type { User as SupabaseUser, AuthChangeEvent, Session } from "@supabase/supabase-js";

interface AppHeaderProps {
    title?: string;
    showBack?: boolean;
}

export function AppHeader({ title, showBack = false }: AppHeaderProps) {
    const router = useRouter();
    const [user, setUser] = useState<SupabaseUser | null>(null);
    const { scrollY } = useScroll();
    const bgOpacity = useTransform(scrollY, [0, 50], [0, 0.8]);
    const blur = useTransform(scrollY, [0, 50], [0, 12]);
    const borderColor = useTransform(scrollY, [0, 50], ["rgba(255,255,255,0)", "rgba(255,255,255,0.05)"]);
    const logoOpacity = useTransform(scrollY, [0, 80], [1, 0.3]);

    useEffect(() => {
        const supabase = createClient();
        supabase.auth.getUser().then(({ data: { user } }: { data: { user: SupabaseUser | null } }) => {
            setUser(user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const getAvatarUrl = () => user?.user_metadata?.avatar_url || null;
    const getUserInitial = () => {
        if (!user) return "?";
        const name = user.user_metadata?.username ||
            user.user_metadata?.display_name ||
            user.email?.split("@")[0] || "P";
        return name.charAt(0).toUpperCase();
    };

    return (
        <motion.header
            className="fixed top-0 left-0 right-0 z-40 pt-safe transition-colors duration-300"
            style={{
                backgroundColor: `rgba(10, 0, 21, ${bgOpacity.get()})`,
                backdropFilter: `blur(${blur.get()}px)`,
                borderBottom: `1px solid ${borderColor.get()}`
            }}
        >
            <div className="flex items-center justify-between h-12 sm:h-14 px-4 sm:px-6 max-w-7xl mx-auto">
                {/* Left: Back button or Logo */}
                <div className="flex items-center gap-3 w-24">
                    {showBack ? (
                        <motion.button
                            onClick={() => router.back()}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 -ml-2 text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </motion.button>
                    ) : (
                        <Link href="/" className="flex items-center gap-2">
                            <motion.div style={{ opacity: logoOpacity }}>
                                <Image
                                    src="/logo.svg"
                                    alt="PartyPack"
                                    width={26}
                                    height={32}
                                    className="h-8 w-auto drop-shadow-[0_0_10px_rgba(255,0,110,0.5)]"
                                />
                            </motion.div>
                        </Link>
                    )}
                </div>

                {/* Center: Title or Logo */}
                <div className="flex-1 text-center">
                    {title ? (
                        <h1 className="font-display text-lg font-bold text-white truncate">
                            {title}
                        </h1>
                    ) : (
                        <Link href="/" className="inline-flex items-center gap-2">
                            <motion.span
                                className="font-display text-lg font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60"
                                style={{ opacity: logoOpacity }}
                            >
                                PARTYPACK
                            </motion.span>
                        </Link>
                    )}
                </div>

                {/* Right: Profile */}
                <div className="flex items-center justify-end w-24">
                    <Link href="/profile">
                        <motion.div whileTap={{ scale: 0.9 }}>
                            {user ? (
                                getAvatarUrl() ? (
                                    <img
                                        src={getAvatarUrl()!}
                                        alt="Profile"
                                        className="w-9 h-9 rounded-full ring-2 ring-white/10"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#ff006e] to-[#8338ec] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-purple-500/20">
                                        {getUserInitial()}
                                    </div>
                                )
                            ) : (
                                <div className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                    <User className="w-5 h-5 text-white/70" />
                                </div>
                            )}
                        </motion.div>
                    </Link>
                </div>
            </div>
        </motion.header>
    );
}
