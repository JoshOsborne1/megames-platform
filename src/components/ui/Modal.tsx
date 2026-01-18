"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal content */
  children: React.ReactNode;
  /** Size preset: sm (320px), md (384px), lg (448px) */
  size?: "sm" | "md" | "lg";
  /** Show close button in top-right corner */
  showCloseButton?: boolean;
  /** Close when clicking the backdrop */
  closeOnBackdropClick?: boolean;
  /** Accent color for close button hover state */
  accentColor?: string;
}

const sizeClasses = {
  sm: "max-w-xs",
  md: "max-w-sm",
  lg: "max-w-md",
};

/**
 * Universal modal component with mobile-safe positioning.
 * Uses flexbox centering to avoid transform conflicts with Framer Motion animations.
 */
export function Modal({
  isOpen,
  onClose,
  children,
  size = "sm",
  showCloseButton = false,
  closeOnBackdropClick = true,
  accentColor = "#ff006e",
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={closeOnBackdropClick ? onClose : undefined}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full ${sizeClasses[size]} relative`}
          >
            <div className="bg-[#0a0015] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-10"
                  style={{ "--hover-color": accentColor } as React.CSSProperties}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
