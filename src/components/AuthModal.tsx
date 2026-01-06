"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, Loader2, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

type AuthMode = "login" | "signup";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: AuthMode;
}

export function AuthModal({ isOpen, onClose, initialMode = "login" }: AuthModalProps) {
    const router = useRouter();
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const resetForm = () => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setUsername("");
        setShowPassword(false);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const switchMode = (newMode: AuthMode) => {
        resetForm();
        setMode(newMode);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Welcome back!");
                handleClose();
                router.refresh();
            }
        } catch {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username,
                        display_name: username,
                    },
                },
            });

            if (error) {
                toast.error(error.message);
            } else {
                toast.success("Check your email to confirm your account!");
                switchMode("login");
            }
        } catch {
            toast.error("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            toast.error(error.message);
        }
    };

    const handleAppleAuth = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithOAuth({
            provider: "apple",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        if (error) {
            toast.error(error.message);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.4 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="bg-[#1a0f2e]/95 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 shadow-2xl w-full max-w-md pointer-events-auto max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                            style={{ boxShadow: '0 0 50px rgba(131, 56, 236, 0.2)' }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8">
                                <button
                                    onClick={handleClose}
                                    className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8338ec] to-[#ff006e] flex items-center justify-center shadow-lg shadow-purple-500/20">
                                        <span className="font-display font-bold text-white text-xs">M</span>
                                    </div>
                                    <span className="font-display text-xl font-bold text-white tracking-widest">MEGAMES</span>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-2 text-white/40 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Title */}
                            <div className="text-center mb-8">
                                <h2 className="font-display text-2xl font-bold text-white mb-2">
                                    {mode === "login" ? "Welcome Back" : "Join the Party"}
                                </h2>
                                <p className="text-white/50 text-sm font-space">
                                    {mode === "login"
                                        ? "Sign in to sync your progress"
                                        : "Create your player profile"}
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={mode === "login" ? handleLogin : handleSignUp} className="space-y-4">
                                {mode === "signup" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="username" className="text-white/60 text-xs font-space uppercase tracking-wider">Username</Label>
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#00f5ff] transition-colors" />
                                            <Input
                                                id="username"
                                                type="text"
                                                value={username}
                                                onChange={(e) => setUsername(e.target.value)}
                                                placeholder="GameMaster99"
                                                className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl focus:border-[#00f5ff]/50 focus:ring-[#00f5ff]/20"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-white/60 text-xs font-space uppercase tracking-wider">Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#00f5ff] transition-colors" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl focus:border-[#00f5ff]/50 focus:ring-[#00f5ff]/20"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-white/60 text-xs font-space uppercase tracking-wider">Password</Label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#00f5ff] transition-colors" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="pl-12 pr-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl focus:border-[#00f5ff]/50 focus:ring-[#00f5ff]/20"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                        </button>
                                    </div>
                                </div>

                                {mode === "signup" && (
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-white/60 text-xs font-space uppercase tracking-wider">Confirm Password</Label>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#00f5ff] transition-colors" />
                                            <Input
                                                id="confirmPassword"
                                                type={showPassword ? "text" : "password"}
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="pl-12 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/20 rounded-xl focus:border-[#00f5ff]/50 focus:ring-[#00f5ff]/20"
                                                required
                                            />
                                        </div>
                                    </div>
                                )}

                                {mode === "login" && (
                                    <div className="flex items-center justify-end">
                                        <button type="button" className="text-xs text-[#00f5ff] hover:text-[#00f5ff]/80 transition-colors font-medium">
                                            Forgot password?
                                        </button>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-14 rounded-xl font-display font-bold text-base bg-gradient-to-r from-[#8338ec] to-[#00f5ff] text-white shadow-lg hover:shadow-[#00f5ff]/25 transition-all active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : mode === "login" ? (
                                        "Sign In"
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>
                            </form>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10"></div>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase tracking-widest font-bold">
                                    <span className="px-4 bg-[#1a0f2e] text-white/30">or continue with</span>
                                </div>
                            </div>

                            {/* OAuth Buttons */}
                            <div className="space-y-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGoogleAuth}
                                    className="w-full h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl font-space font-medium"
                                >
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                                        <path
                                            fill="currentColor"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="currentColor"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    Google
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAppleAuth}
                                    className="w-full h-12 bg-white/5 border-white/10 text-white hover:bg-white/10 hover:border-white/20 rounded-xl font-space font-medium"
                                >
                                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                                    </svg>
                                    Apple
                                </Button>
                            </div>

                            {/* Switch mode */}
                            <p className="text-center text-white/40 mt-8 text-sm font-space">
                                {mode === "login" ? (
                                    <>
                                        Don&apos;t have an account?{" "}
                                        <button
                                            type="button"
                                            onClick={() => switchMode("signup")}
                                            className="text-[#ff006e] hover:text-[#ff006e]/80 transition-colors font-bold ml-1"
                                        >
                                            Sign Up
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        Already have an account?{" "}
                                        <button
                                            type="button"
                                            onClick={() => switchMode("login")}
                                            className="text-[#00f5ff] hover:text-[#00f5ff]/80 transition-colors font-bold ml-1"
                                        >
                                            Sign In
                                        </button>
                                    </>
                                )}
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
