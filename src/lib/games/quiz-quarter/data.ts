// Quiz Quarter - Question Packs & Decks Data
import { Question, DeckInfo, PackInfo, QuizTypeInfo } from "./types";
import { ALL_MODULAR_QUESTIONS } from "./questions";

// =============================================================================
// QUIZ TYPE DEFINITIONS
// =============================================================================

export const QUIZ_TYPES: QuizTypeInfo[] = [
    {
        id: "mixed",
        name: "Mixed Quiz",
        description: "Random questions from all categories",
        icon: "Shuffle",
        accentColor: "#22C55E",
        isFreeAccess: true,
    },
    {
        id: "knowledge",
        name: "Knowledge",
        description: "Geography, History & Science",
        icon: "Brain",
        accentColor: "#8338EC",
        isFreeAccess: false,
    },
    {
        id: "pop-culture",
        name: "Pop Culture",
        description: "Music, Sports & Entertainment",
        icon: "Music",
        accentColor: "#FF006E",
        isFreeAccess: false,
    },
    {
        id: "riddles",
        name: "Riddles",
        description: "Brain teasers & word puzzles",
        icon: "Lightbulb",
        accentColor: "#F59E0B",
        isFreeAccess: false,
        isComingSoon: true,
    },
    {
        id: "math",
        name: "Math",
        description: "Numbers, equations & calculations",
        icon: "Calculator",
        accentColor: "#EF4444",
        isFreeAccess: false,
        isComingSoon: true,
    },
];

// =============================================================================
// PACK DEFINITIONS
// =============================================================================

export const PACKS: PackInfo[] = [
    // KNOWLEDGE PACKS
    {
        id: "geography",
        name: "Geography Pack",
        description: "Explore the world through capitals, flags, and countries",
        icon: "Globe",
        accentColor: "#22C55E",
        deckIds: ["capitals", "flags", "countries", "languages"],
        price: 2.99,
        type: "knowledge",
    },
    {
        id: "history",
        name: "History Pack",
        description: "Journey through time with figures and major events",
        icon: "Landmark",
        accentColor: "#F59E0B",
        deckIds: ["dates", "famous-figures", "events", "locations"],
        price: 2.99,
        type: "knowledge",
    },
    {
        id: "science",
        name: "Science Pack",
        description: "Unravel the mysteries of biology, physics, and space",
        icon: "FlaskConical",
        accentColor: "#3B82F6",
        deckIds: ["biology", "physics", "astronomy", "chemistry"],
        price: 2.99,
        type: "knowledge",
    },

    // POP CULTURE PACKS
    {
        id: "music",
        name: "Music Pack",
        description: "From artists to lyrics, awards to album titles",
        icon: "Music",
        accentColor: "#A855F7",
        deckIds: ["artists", "lyrics", "awards", "titles"],
        price: 2.99,
        type: "pop-culture",
    },
    {
        id: "sports",
        name: "Sports Pack",
        description: "Test your knowledge of athletes, teams, and events",
        icon: "Trophy",
        accentColor: "#EF4444",
        deckIds: ["athletes", "sports-teams", "sports-terms", "sports-events"],
        price: 2.99,
        type: "pop-culture",
    },
    {
        id: "entertainment",
        name: "Cinema & Gaming",
        description: "Movies, TV shows, and gaming icons",
        icon: "Ticket",
        accentColor: "#EC4899",
        deckIds: ["movies", "tv-shows", "gaming", "pop-icons"],
        price: 2.99,
        type: "pop-culture",
    },

    // RIDDLES PACKS (Coming Soon)
    {
        id: "classic-riddles",
        name: "Classic Riddles",
        description: "Brain teasers & word puzzles",
        icon: "Lightbulb",
        accentColor: "#F59E0B",
        deckIds: [],
        price: 0,
        type: "riddles",
    },

    // MATH PACKS (Coming Soon)
    {
        id: "arithmetic",
        name: "Arithmetic Pack",
        description: "Addition, subtraction & more",
        icon: "Calculator",
        accentColor: "#EF4444",
        deckIds: [],
        price: 0,
        type: "math",
    },
];

// =============================================================================
// DECK DEFINITIONS
// =============================================================================

export const DECKS: DeckInfo[] = [
    // Geography Pack
    { id: "capitals", name: "Capitals", description: "World capital cities", icon: "Building2", accentColor: "#22C55E", packId: "geography", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "flags", name: "Flags", description: "Identify country flags", icon: "Flag", accentColor: "#22C55E", packId: "geography", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "countries", name: "Countries", description: "Country facts & trivia", icon: "MapPin", accentColor: "#22C55E", packId: "geography", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "languages", name: "Languages", description: "Languages of the world", icon: "Languages", accentColor: "#22C55E", packId: "geography", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    // History Pack
    { id: "dates", name: "Dates", description: "Key historical dates", icon: "Calendar", accentColor: "#F59E0B", packId: "history", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "famous-figures", name: "Famous Figures", description: "Historical personalities", icon: "User", accentColor: "#F59E0B", packId: "history", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "events", name: "Events", description: "Major historical events", icon: "Scroll", accentColor: "#F59E0B", packId: "history", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "locations", name: "Locations", description: "Historic places", icon: "Castle", accentColor: "#F59E0B", packId: "history", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    // Sports Pack
    { id: "athletes", name: "Athletes", description: "Famous sports stars", icon: "Medal", accentColor: "#EF4444", packId: "sports", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "sports-terms", name: "Sports Terms", description: "Sport-specific jargon", icon: "Dumbbell", accentColor: "#EF4444", packId: "sports", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "sports-events", name: "Sports Events", description: "Olympics, World Cups & more", icon: "Flame", accentColor: "#EF4444", packId: "sports", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "sports-teams", name: "Sports Teams", description: "Famous clubs & franchises", icon: "Shield", accentColor: "#EF4444", packId: "sports", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    // Science Pack
    { id: "biology", name: "Biology", description: "Life and living organisms", icon: "Dna", accentColor: "#3B82F6", packId: "science", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "physics", name: "Physics", description: "Matter, energy, and forces", icon: "Zap", accentColor: "#3B82F6", packId: "science", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "astronomy", name: "Astronomy", description: "Space and the universe", icon: "Telescope", accentColor: "#3B82F6", packId: "science", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "chemistry", name: "Chemistry", description: "Elements and reactions", icon: "Atom", accentColor: "#3B82F6", packId: "science", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    // Music Pack
    { id: "artists", name: "Artists", description: "Musicians & bands", icon: "Mic2", accentColor: "#A855F7", packId: "music", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "lyrics", name: "Lyrics", description: "Name that song", icon: "Quote", accentColor: "#A855F7", packId: "music", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "awards", name: "Awards", description: "Grammys & music awards", icon: "Award", accentColor: "#A855F7", packId: "music", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "titles", name: "Titles", description: "Songs & album names", icon: "Disc3", accentColor: "#A855F7", packId: "music", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    // Entertainment Pack
    { id: "movies", name: "Movies", description: "Cinema & film history", icon: "Clapperboard", accentColor: "#EC4899", packId: "entertainment", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "tv-shows", name: "TV Shows", description: "Small screen classics", icon: "Tv", accentColor: "#EC4899", packId: "entertainment", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "gaming", name: "Gaming", description: "Video games & esports", icon: "Gamepad2", accentColor: "#EC4899", packId: "entertainment", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
    { id: "pop-icons", name: "Pop Icons", description: "Famous celebrities", icon: "Star", accentColor: "#EC4899", packId: "entertainment", questionCount: 0, isPremium: false, freeQuestionLimit: 50 },
];

// =============================================================================
// QUESTIONS - MODULARIZED
// =============================================================================

export const ALL_QUESTIONS: Question[] = ALL_MODULAR_QUESTIONS;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getQuestionsByDeck(deckId: string): Question[] {
    return ALL_QUESTIONS.filter(q => q.deckId === deckId);
}

export function getDeckInfo(deckId: string): DeckInfo | undefined {
    return DECKS.find(d => d.id === deckId);
}

export function getQuestionsByPack(packId: string): Question[] {
    return ALL_QUESTIONS.filter(q => q.packId === packId);
}

export function getQuestionsByDifficulty(difficulty: string): Question[] {
    if (difficulty === "mixed") return ALL_QUESTIONS;
    return ALL_QUESTIONS.filter(q => q.difficulty === difficulty);
}

export function getPackInfo(packId: string): PackInfo | undefined {
    return PACKS.find(p => p.id === packId);
}

export function getDecksByPack(packId: string): DeckInfo[] {
    return DECKS.filter(d => d.packId === packId);
}

// Update deck question counts
DECKS.forEach(deck => {
    deck.questionCount = getQuestionsByDeck(deck.id).length;
});
