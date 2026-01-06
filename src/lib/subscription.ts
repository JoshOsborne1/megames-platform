/**
 * Subscription & Monetization Configuration
 * 
 * This file contains all tier limits, pricing, and subscription-related constants.
 */

// Game Limits Configuration
export interface GameLimits {
    dynamicDecks: number;      // Cards per deck
    shadeSignals: number;      // Available colours
    lyricLegends: number;      // Available words
    quizQuarter: number;       // Available questions
    localPlayers: number;      // Max players in local lobby
    multiplayerPlayers: number;// Max players in multiplayer lobby
    fullDeckAccess?: number;   // Number of full decks accessed
    quizPacks?: number;        // Number of quiz packs accessed
}

export const FREE_LIMITS: GameLimits = {
    dynamicDecks: 100,
    shadeSignals: 40,
    lyricLegends: 100,
    quizQuarter: 50,
    localPlayers: 4,
    multiplayerPlayers: 3,
};

export const PRO_LIMITS: GameLimits = {
    dynamicDecks: 250,
    shadeSignals: 75,
    lyricLegends: 250,
    quizQuarter: 150, // "3 Quiz Packs" - assuming ~50 per pack
    localPlayers: 8,
    multiplayerPlayers: 6,
    fullDeckAccess: 1,
    quizPacks: 3,
};

// "Full deck & game access across the board" for One-Time passes
export const UNLIMITED_LIMITS: GameLimits = {
    dynamicDecks: 9999,
    shadeSignals: 9999,
    lyricLegends: 9999,
    quizQuarter: 9999,
    localPlayers: 10, // Mega limit
    multiplayerPlayers: 10, // Mega limit
    fullDeckAccess: 9999,
    quizPacks: 9999,
};

// Ad reward bonuses (per ad watched)
export const AD_REWARDS = {
    lobbyPlayerBoost: 1,   // +1 player to lobby (non-renewable)
    gameAccessBoost: 0.10, // +10% game content (per person, per lobby)
} as const;

// Pricing Configuration
export type Currency = "GBP";

export interface PricingTier {
    id: string;
    label: string;
    price: number;
    currency: Currency;
    period?: "week" | "month" | "year" | "day"; // Subscription period or day pass
    description: string;
    features: string[];
    highlight?: boolean;
    savings?: string;
}

export const SUBSCRIPTION_PLANS: PricingTier[] = [
    {
        id: "gamepro_weekly",
        label: "Weekly",
        price: 2.99,
        currency: "GBP",
        period: "week",
        description: "Perfect for a weekend of fun",
        features: [
            "Up to 8 player local lobbies",
            "Up to 6 player multiplayer lobbies",
            "75 Shade Signal colours",
            "250 Lyric Legend words",
            "250 Dynamic Decks cards",
            "1 Monthly Full Deck Access",
            "3 Monthly Quiz Packs",
        ]
    },
    {
        id: "gamepro_monthly",
        label: "Monthly",
        price: 7.99,
        currency: "GBP",
        period: "month",
        description: "Best value for regular players",
        features: [
            "All Weekly features included",
            "Monthly rotation of Full Deck",
            "Monthly rotation of Quiz Packs",
        ],
        highlight: true
    },
    {
        id: "gamepro_yearly",
        label: "Yearly",
        price: 18.99,
        currency: "GBP",
        period: "year",
        description: "Massive discount for year-round fun",
        features: [
            "All Monthly features included",
            "Get 2 months free",
            "Priority support", // Added filler
        ],
        savings: "Save 80% vs Weekly"
    }
];

export const ONE_TIME_PASSES: PricingTier[] = [
    {
        id: "gamenight_group",
        label: "GameNight - Group",
        price: 4.99,
        currency: "GBP",
        period: "day",
        description: "24h Pass for a standard group",
        features: [
            "Full deck & game access",
            "Up to 6 player lobbies (Local & Multi)",
            "Random Icon unlock",
            "+10% cards retention after expiry"
        ]
    },
    {
        id: "gamenight_mega",
        label: "GameNight - Mega",
        price: 6.99,
        currency: "GBP",
        period: "day",
        description: "24h Pass for a large party",
        features: [
            "Full deck & game access",
            "Up to 10 player lobbies (Local & Multi)",
            "Random Icon & Title unlock",
            "+10% cards retention after expiry",
            "20% off next purchase"
        ],
        highlight: true
    }
];

// Re-export old constants for backward compatibility if needed, but updated values
export const PRICING = {
    weekly: SUBSCRIPTION_PLANS[0],
    monthly: SUBSCRIPTION_PLANS[1],
    yearly: SUBSCRIPTION_PLANS[2],
};

export const QUIZPRO_BENEFITS = [
    { icon: "users", text: "Up to 8 player local lobbies" },
    { icon: "globe", text: "Up to 6 player multiplayer lobbies" },
    { icon: "palette", text: "75 colours in Shade Signals" },
    { icon: "music", text: "250 words in Lyric Legends" },
    { icon: "cards", text: "250 cards in Dynamic Decks" },
    { icon: "unlock", text: "1 Full Deck Access (Monthly)" },
    { icon: "help-circle", text: "3 Quiz Packs (Monthly)" },
];

export type SubscriptionTier = "free" | "gamepro" | "mega" | "group";

export function getLimits(tier: SubscriptionTier | null | undefined): GameLimits {
    switch (tier) {
        case "gamepro":
            return PRO_LIMITS;
        case "mega":
            return UNLIMITED_LIMITS;
        case "group":
            return { ...UNLIMITED_LIMITS, localPlayers: 6, multiplayerPlayers: 6 };
        default:
            return FREE_LIMITS;
    }
}
