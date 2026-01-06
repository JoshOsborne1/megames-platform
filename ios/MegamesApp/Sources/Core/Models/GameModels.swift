import SwiftUI

/// Game data model
struct GameInfo: Identifiable {
    let id: String
    let name: String
    let shortDescription: String
    let description: String
    let icon: String
    let playerRange: String
    let duration: String
    let accentColor: Color
    let rules: [String]
    
    static let allGames: [GameInfo] = [
        GameInfo(
            id: "dynamic-decks",
            name: "Dynamic Decks",
            shortDescription: "Get your team to guess the word!",
            description: "A fast-paced word guessing game where you give clues without using forbidden words. Race against the timer to score as many points as possible!",
            icon: "rectangle.stack.fill",
            playerRange: "2-10",
            duration: "15-30 min",
            accentColor: .megamesPrimary,
            rules: [
                "One player is the clue giver, others guess",
                "Describe the word without using forbidden words",
                "Earn points for each correct guess",
                "Pass the turn when the timer runs out",
                "Highest score wins!"
            ]
        ),
        GameInfo(
            id: "lyric-legends",
            name: "Lyric Legends",
            shortDescription: "Test your music knowledge!",
            description: "Complete the lyrics to iconic songs across different genres and decades. Perfect for music lovers and party nights!",
            icon: "music.note.list",
            playerRange: "2-10",
            duration: "20-40 min",
            accentColor: .megamesSecondary,
            rules: [
                "A lyric snippet is shown with a missing word",
                "Players race to complete the lyrics",
                "First correct answer scores points",
                "Bonus points for artist knowledge",
                "Master of lyrics wins!"
            ]
        ),
        GameInfo(
            id: "lyric-echoes",
            name: "Lyric Echoes",
            shortDescription: "Rhyme your way to victory!",
            description: "Guess rhyming phrases from clever clues. A creative word game that tests your linguistic skills!",
            icon: "waveform",
            playerRange: "2-8",
            duration: "15-25 min",
            accentColor: .cardGreen,
            rules: [
                "Read the clue for a rhyming phrase",
                "The answer is always two rhyming words",
                "Example: 'Overweight feline' = 'Fat Cat'",
                "Faster answers earn more points",
                "Most points wins!"
            ]
        ),
        GameInfo(
            id: "shade-signals",
            name: "Shade Signals",
            shortDescription: "Find the color match!",
            description: "A visual puzzle game where you match colors and signals. Test your perception and quick thinking!",
            icon: "paintpalette.fill",
            playerRange: "2-6",
            duration: "10-20 min",
            accentColor: .megamesAccent,
            rules: [
                "Colors are shown in sequence",
                "Match the pattern to score",
                "Speed matters - faster is better",
                "Watch out for trick patterns",
                "Sharp eyes win!"
            ]
        )
    ]
}

/// Player model for games
struct Player: Identifiable, Equatable, Codable {
    let id: String
    var name: String
    var score: Int
    
    init(id: String = UUID().uuidString, name: String, score: Int = 0) {
        self.id = id
        self.name = name
        self.score = score
    }
}

/// Game state for Dynamic Decks
struct GameState: Codable {
    var players: [Player]
    var currentPlayerIndex: Int
    var clueGiverIndex: Int
    var difficulty: Difficulty
    var gameMode: GameMode
    var currentRound: Int
    var maxRounds: Int
    var score: Int
    var timer: Int
    var phase: GamePhase
    var currentCard: Card?
    var usedCardIds: [String]
    var roundScore: Int
    var skipsUsed: Int
    var cardsInRound: Int
    var maxCardsInRound: Int
    var deckId: String
    var lastWinnerId: String?
    
    enum Difficulty: String, Codable, CaseIterable {
        case easy, medium, hard, random
        
        var displayName: String {
            rawValue.capitalized
        }
    }
    
    enum GameMode: String, Codable, CaseIterable {
        case classic
        case questionMaster = "question-master"
        
        var displayName: String {
            switch self {
            case .classic: return "Classic"
            case .questionMaster: return "Question Master"
            }
        }
    }
    
    enum GamePhase: String, Codable {
        case setup
        case instructions
        case playing
        case roundSummary = "round-summary"
        case gameOver = "game-over"
        case turnEnded = "turn-ended"
    }
}

/// Card model for Dynamic Decks
struct Card: Identifiable, Codable, Equatable {
    let id: String
    let word: String
    let forbidden: [String]
    let points: Int
    let color: CardColorType
    let difficulty: String
    let clue: String?
    let answer: String?
    
    enum CardColorType: String, Codable {
        case yellow, blue, green, red
        
        var color: Color {
            switch self {
            case .yellow: return .cardYellow
            case .blue: return .cardBlue
            case .green: return .cardGreen
            case .red: return .cardRed
            }
        }
    }
}

/// Deck information
struct DeckInfo: Identifiable, Codable {
    let id: String
    let name: String
    let description: String
    let icon: String
    let cardCount: Int
    let accentColor: String
    let deckType: DeckType
    
    enum DeckType: String, Codable {
        case forbidden
        case rhymes
    }
}
