"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Search,
    Shield,
    Crown,
    Users,
    Loader2,
    Check,
    X,
    ChevronRight,
    AlertTriangle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Profile } from "@/lib/database.types";

export default function AdminPage() {
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Profile[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
    const [updating, setUpdating] = useState(false);

    // Check if current user is admin
    useEffect(() => {
        const checkAdmin = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/");
                return;
            }

            // Check if user is admin
            const { data: profile } = await supabase
                .from("profiles")
                .select("is_admin")
                .eq("id", user.id)
                .single();

            if (!profile?.is_admin) {
                toast.error("Access denied - Admin only");
                router.push("/");
                return;
            }

            setIsAdmin(true);
            setLoading(false);
        };

        checkAdmin();
    }, [router]);

    // Search users
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setSearching(true);
        const supabase = createClient();

        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .or(`username.ilike.%${searchQuery}%,display_name.ilike.%${searchQuery}%`)
            .limit(20);

        if (error) {
            toast.error("Search failed");
            console.error(error);
        } else {
            setSearchResults(data || []);
        }
        setSearching(false);
    };

    // Toggle QuizPro status
    const togglePro = async (userId: string, currentlyPro: boolean) => {
        setUpdating(true);
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (currentlyPro) {
            // Remove pro
            const { error } = await supabase
                .from("profiles")
                .update({
                    is_pro: false,
                    pro_tier: null,
                    pro_expires_at: null,
                    pro_granted_by: null,
                })
                .eq("id", userId);

            if (error) {
                toast.error("Failed to remove Pro");
            } else {
                toast.success("Pro status removed");
                // Update local state
                setSearchResults(prev =>
                    prev.map(p => p.id === userId ? { ...p, is_pro: false } : p)
                );
                if (selectedUser?.id === userId) {
                    setSelectedUser({ ...selectedUser, is_pro: false });
                }
            }
        } else {
            // Grant pro (1 year by default for admin grants)
            const expiresAt = new Date();
            expiresAt.setFullYear(expiresAt.getFullYear() + 1);

            const { error } = await supabase
                .from("profiles")
                .update({
                    is_pro: true,
                    pro_tier: "yearly",
                    pro_expires_at: expiresAt.toISOString(),
                    pro_granted_by: user?.id,
                })
                .eq("id", userId);

            if (error) {
                toast.error("Failed to grant Pro");
            } else {
                // Also create a grant record
                await supabase
                    .from("pro_grants")
                    .insert({
                        granter_id: user?.id,
                        grantee_id: userId,
                        expires_at: expiresAt.toISOString(),
                        reason: "admin",
                    });

                toast.success("Pro status granted for 1 year");
                setSearchResults(prev =>
                    prev.map(p => p.id === userId ? { ...p, is_pro: true } : p)
                );
                if (selectedUser?.id === userId) {
                    setSelectedUser({ ...selectedUser, is_pro: true });
                }
            }
        }
        setUpdating(false);
    };

    // Toggle admin status
    const toggleAdmin = async (userId: string, currentlyAdmin: boolean) => {
        setUpdating(true);
        const supabase = createClient();

        const { error } = await supabase
            .from("profiles")
            .update({ is_admin: !currentlyAdmin })
            .eq("id", userId);

        if (error) {
            toast.error("Failed to update admin status");
        } else {
            toast.success(currentlyAdmin ? "Admin removed" : "Admin granted");
            setSearchResults(prev =>
                prev.map(p => p.id === userId ? { ...p, is_admin: !currentlyAdmin } : p)
            );
            if (selectedUser?.id === userId) {
                setSelectedUser({ ...selectedUser, is_admin: !currentlyAdmin });
            }
        }
        setUpdating(false);
    };

    if (loading) {
        return (
            <AppShell>
                <div className="flex items-center justify-center h-[60vh]">
                    <Loader2 className="w-8 h-8 animate-spin text-[#ff006e]" />
                </div>
            </AppShell>
        );
    }

    if (!isAdmin) {
        return null;
    }

    return (
        <AppShell>
            <div className="px-4 py-4 max-w-2xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 mb-6"
                >
                    <div className="p-2 bg-[#ff006e]/20 rounded-lg">
                        <Shield className="w-6 h-6 text-[#ff006e]" />
                    </div>
                    <div>
                        <h1 className="font-display text-2xl font-bold text-white">
                            Admin Panel
                        </h1>
                        <p className="text-gray-400 text-sm">Manage users & subscriptions</p>
                    </div>
                </motion.div>

                {/* Search */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6"
                >
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="Search by username..."
                                className="pl-10 bg-[#16162a] border-white/10 text-white"
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            disabled={searching}
                            className="bg-[#ff006e] hover:bg-[#ff006e]/90 text-white"
                        >
                            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
                        </Button>
                    </div>
                </motion.div>

                {/* Results */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                >
                    {searchResults.length === 0 && searchQuery && !searching && (
                        <div className="text-center py-8 text-gray-500">
                            No users found
                        </div>
                    )}

                    {searchResults.map((profile) => (
                        <div
                            key={profile.id}
                            className="bg-[#16162a] border border-white/10 rounded-xl p-4"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {/* Avatar */}
                                    {profile.avatar_url ? (
                                        <img
                                            src={profile.avatar_url}
                                            alt={profile.username || "User"}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#ff006e] to-[#8338ec] flex items-center justify-center text-white font-bold">
                                            {(profile.username || "U").charAt(0).toUpperCase()}
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-white font-medium">
                                                {profile.username || profile.display_name || "Unknown"}
                                            </span>
                                            {profile.is_admin && (
                                                <span className="px-2 py-0.5 text-xs bg-[#ff006e]/20 text-[#ff006e] rounded-full">
                                                    Admin
                                                </span>
                                            )}
                                            {profile.is_pro && (
                                                <span className="px-2 py-0.5 text-xs bg-[#FFD700]/20 text-[#FFD700] rounded-full flex items-center gap-1">
                                                    <Crown className="w-3 h-3" />
                                                    Pro
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-500 text-xs">
                                            ID: {profile.id.slice(0, 8)}...
                                        </p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => togglePro(profile.id, profile.is_pro)}
                                        disabled={updating}
                                        className={`border-white/10 ${profile.is_pro
                                                ? "text-red-400 hover:bg-red-500/10"
                                                : "text-[#FFD700] hover:bg-[#FFD700]/10"
                                            }`}
                                    >
                                        {profile.is_pro ? (
                                            <>
                                                <X className="w-4 h-4 mr-1" />
                                                Remove Pro
                                            </>
                                        ) : (
                                            <>
                                                <Crown className="w-4 h-4 mr-1" />
                                                Grant Pro
                                            </>
                                        )}
                                    </Button>

                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => toggleAdmin(profile.id, profile.is_admin)}
                                        disabled={updating}
                                        className={`border-white/10 ${profile.is_admin
                                                ? "text-red-400 hover:bg-red-500/10"
                                                : "text-[#ff006e] hover:bg-[#ff006e]/10"
                                            }`}
                                    >
                                        {profile.is_admin ? (
                                            <>
                                                <X className="w-4 h-4 mr-1" />
                                                Remove Admin
                                            </>
                                        ) : (
                                            <>
                                                <Shield className="w-4 h-4 mr-1" />
                                                Make Admin
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* Pro details if applicable */}
                            {profile.is_pro && profile.pro_expires_at && (
                                <div className="mt-3 pt-3 border-t border-white/5 text-xs text-gray-500">
                                    Expires: {new Date(profile.pro_expires_at).toLocaleDateString()}
                                    {profile.pro_tier && ` • ${profile.pro_tier} plan`}
                                </div>
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* Quick Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 p-4 bg-[#16162a] border border-white/10 rounded-xl"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Users className="w-5 h-5 text-gray-400" />
                        <span className="text-white font-medium">Quick Actions</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                        Search for users by username to grant or revoke QuizPro subscriptions.
                        Admin grants last 1 year by default.
                    </p>
                </motion.div>
            </div>
        </AppShell>
    );
}
