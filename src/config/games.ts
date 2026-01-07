import {
    Mic2,
    ShieldAlert,
    Eye,
    LucideIcon
} from "lucide-react";

export interface GameConfig {
    id: string;
    name: string;
    description: string;
    fullDescription?: string;
    icon: LucideIcon;
    color: string;
    route: string;
    isHot?: boolean;
    playerCount?: string;
    duration?: string;
    slogan?: string;
    tags?: string[];
}

export const GAMES: GameConfig[] = [
    {
        id: "dynamic-decks",
        name: "Dynamic Decks",
        description: "Classic card games, without the cards.",
        fullDescription: "A collection of your favorite party card games, all in one digital deck. No shuffling, no setup—just pure fun!",
        icon: ShieldAlert,
        color: "#ff006e", // Red - matches in-game accent
        route: "/games/dynamic-decks",
        isHot: true,
        playerCount: "2-8",
        duration: "15-30m",
        slogan: "Words Unleashed",
        tags: ["Party", "Card Games", "No Setup"],
    },
    {
        id: "lyric-legends",
        name: "Lyric Legends",
        description: "Music Trivia & Karaoke Race.",
        fullDescription: "Be the fastest to sing a lyric containing the prompt word. Music lovers unite for this hilarious party game!",
        icon: Mic2,
        color: "#FF00FF", // Neon Magenta (more vibrant)
        route: "/games/lyric-legends",
        playerCount: "2-10",
        duration: "20-45m",
        slogan: "Sing to Win",
        tags: ["Music", "Karaoke", "Party"],
    },
    {
        id: "shade-signals",
        name: "Shade Signals",
        description: "Social Deduction Party Game.",
        fullDescription: "Give cryptic clues to guide your team to the secret color. A beautiful blend of art and deduction!",
        icon: Eye,
        color: "#00FFFF", // Bright Cyan
        route: "/games/shade-signals",
        playerCount: "2-10",
        slogan: "Find the Hue",
        tags: ["Deduction", "Colors", "Teams"],
    }
];
