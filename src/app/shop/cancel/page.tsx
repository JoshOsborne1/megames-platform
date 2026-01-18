"use client";

import { motion } from "framer-motion";
import { AppShell } from "@/components/AppShell";
import { XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CheckoutCancelPage() {
    return (
        <AppShell>
            <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-md"
                >
                    {/* Cancel Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/10 flex items-center justify-center"
                    >
                        <XCircle className="w-12 h-12 text-white/40" />
                    </motion.div>

                    {/* Title */}
                    <h1 className="font-display font-bold text-3xl text-white mb-2">
                        Checkout Cancelled
                    </h1>
                    <p className="text-white/60 mb-8">
                        No worries! Your payment was not processed. You can try again whenever you&apos;re ready.
                    </p>

                    {/* CTA */}
                    <Link href="/shop">
                        <motion.button
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 rounded-xl font-display font-bold text-lg uppercase tracking-wider bg-white/10 text-white border border-white/20 flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Shop
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        </AppShell>
    );
}
