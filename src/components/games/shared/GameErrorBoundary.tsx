"use client";

import React, { Component, ReactNode } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  gameName?: string;
  fallbackUrl?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary for Game Components
 * Catches runtime errors and displays a user-friendly fallback UI
 */
export class GameErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error reporting service in production
    console.error("[GameErrorBoundary] Caught error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const { gameName = "Game", fallbackUrl = "/" } = this.props;

      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full text-center"
          >
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>

            {/* Error Message */}
            <h2 className="font-display font-bold text-2xl text-white mb-2">
              Something Went Wrong
            </h2>
            <p className="text-white/50 mb-6">
              {gameName} encountered an unexpected error. Don&apos;t worry, your progress may be saved.
            </p>

            {/* Error Details (dev only) */}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10 text-left">
                <p className="text-xs text-white/40 uppercase tracking-wider mb-2">Error Details</p>
                <code className="text-xs text-red-400 block overflow-auto max-h-32">
                  {this.state.error.message}
                </code>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-colors"
              >
                <RefreshCcw className="w-4 h-4" /> Retry
              </button>
              <Link
                href={fallbackUrl}
                className="flex-1 py-3 rounded-xl bg-neon-pink text-white font-medium flex items-center justify-center gap-2 hover:brightness-110 transition-all"
              >
                <Home className="w-4 h-4" /> Exit
              </Link>
            </div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default GameErrorBoundary;
