"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BentoGrid = ({
    className,
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
                className
            )}
        >
            {children}
        </div>
    );
};

export const BentoGridItem = ({
    className,
    title,
    description,
    header,
    icon,
    onClick,
}: {
    className?: string;
    title?: string | React.ReactNode;
    description?: string | React.ReactNode;
    header?: React.ReactNode;
    icon?: React.ReactNode;
    onClick?: () => void;
}) => {
    return (
        <motion.div
            onClick={onClick}
            whileHover={{ y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "row-span-1 rounded-3xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 glass-card flex flex-col space-y-4 cursor-pointer",
                className
            )}
        >
            {header}
            <div className="group-hover/bento:translate-x-2 transition duration-200 flex-1 flex flex-col justify-end">
                {icon}
                <div className="font-display font-bold text-neutral-200 mb-2 mt-2">
                    {title}
                </div>
                <div className="font-sans font-normal text-neutral-400 text-xs">
                    {description}
                </div>
            </div>
        </motion.div>
    );
};
