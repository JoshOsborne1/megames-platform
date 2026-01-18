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
    dynamicDecks: 500,
    shadeSignals: 9999, // Unlimited
    lyricLegends: 500,
    quizQuarter: 150, // 3 Quiz Packs
    localPlayers: 10,
    multiplayerPlayers: 10,
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
        id: "partypro_weekly",
        label: "Weekly",
        price: 2.99,
        currency: "GBP",
        period: "week",
        description: "Unlock the full party experience for a weekend of epic game nights with friends.",
        features: [
            "Up to 10 player local lobbies",
            "Up to 10 player multiplayer lobbies",
            "Unlimited Shade Signal colours",
            "500 Lyric Legend words",
            "500 Dynamic Deck cards per deck",
            "3 Quiz Packs (selected on purchase)",
            "50% off all full pack purchases",
            "50% off Day Passes",
        ]
    },
    {
        id: "partypro_monthly",
        label: "Monthly",
        price: 8.99,
        currency: "GBP",
        period: "month",
        description: "The ultimate choice for game enthusiasts. Fresh quiz packs every month keep the fun going!",
        features: [
            "Up to 10 player local lobbies",
            "Up to 10 player multiplayer lobbies",
            "Unlimited Shade Signal colours",
            "500 Lyric Legend words",
            "500 Dynamic Deck cards per deck",
            "3 Quiz Packs (changes monthly)",
            "50% off all full pack purchases",
            "50% off Day Passes",
        ],
        highlight: true
    },
    {
        id: "partypro_yearly",
        label: "Yearly",
        price: 27.99,
        currency: "GBP",
        period: "year",
        description: "Unbeatable value! A full year of unlimited party games at a fraction of the cost.",
        features: [
            "Up to 10 player local lobbies",
            "Up to 10 player multiplayer lobbies",
            "Unlimited Shade Signal colours",
            "500 Lyric Legend words",
            "500 Dynamic Deck cards per deck",
            "3 Quiz Packs (changes monthly)",
            "50% off all full pack purchases",
            "50% off Day Passes",
        ],
        savings: "Save 80%"
    }
];

export const ONE_TIME_PASSES: PricingTier[] = [
    {
        id: "partypack_standard",
        label: "PartyPack - Standard",
        price: 4.99,
        currency: "GBP",
        period: "day",
        description: "Everything you need for one amazing game night. No commitment, full fun!",
        features: [
            "Full deck & game access",
            "Up to 6 player lobbies (Local & Multi)",
            "+10% cards retention after expiry"
        ]
    },
    {
        id: "partypack_party",
        label: "PartyPack - Party",
        price: 6.99,
        currency: "GBP",
        period: "day",
        description: "Go big! 24 hours of unlimited access for your whole crew. Perfect for house parties.",
        features: [
            "Full deck & game access",
            "Up to 10 player lobbies (Local & Multi)",
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

export type SubscriptionTier = "free" | "partypro" | "party" | "standard";

export function getLimits(tier: SubscriptionTier | null | undefined): GameLimits {
    switch (tier) {
        case "partypro":
            return PRO_LIMITS;
        case "party":
            return UNLIMITED_LIMITS;
        case "standard":
            return { ...UNLIMITED_LIMITS, localPlayers: 6, multiplayerPlayers: 6 };
        default:
            return FREE_LIMITS;
    }
}
