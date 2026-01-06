"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Gamepad2, User, ShoppingBag } from "lucide-react";

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    matchPaths?: string[];
}

const navItems: NavItem[] = [
    {
        href: "/",
        label: "Home",
        icon: Home,
        matchPaths: ["/"]
    },
    {
        href: "/games",
        label: "Games",
        icon: Gamepad2,
        matchPaths: ["/games"]
    },
    {
        href: "/shop",
        label: "Shop",
        icon: ShoppingBag,
        matchPaths: ["/shop"]
    },
    {
        href: "/profile",
        label: "Profile",
        icon: User,
        matchPaths: ["/profile", "/login", "/signup"]
    },
];

interface BottomNavProps {
    hidden?: boolean;
}

export function BottomNav({ hidden = false }: BottomNavProps) {
    const pathname = usePathname();

    const isActive = (item: NavItem) => {
        if (item.matchPaths) {
            return item.matchPaths.some(path =>
                path === "/" ? pathname === "/" : pathname.startsWith(path)
            );
        }
        return pathname === item.href;
    };

    if (hidden) return null;

    return (
        <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <nav className="glass-panel rounded-full px-6 py-3 pointer-events-auto mx-4 shadow-2xl shadow-black/50 ring-1 ring-white/10">
                <div className="flex items-center gap-8">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="relative"
                            >
                                <motion.div
                                    whileTap={{ scale: 0.9 }}
                                    className="flex flex-col items-center gap-1"
                                >
                                    <div className={`relative p-2 rounded-xl transition-all duration-300 ${active
                                        ? "text-white"
                                        : "text-gray-400 hover:text-gray-200"
                                        }`}>
                                        {active && (
                                            <motion.div
                                                layoutId="navGlow"
                                                className="absolute inset-0 bg-white/10 rounded-xl blur-sm"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <Icon className="w-6 h-6 relative z-10" />
                                    </div>

                                    {active && (
                                        <motion.div
                                            layoutId="activeDot"
                                            className="absolute -bottom-1 w-1 h-1 bg-white rounded-full box-shadow-glow"
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
