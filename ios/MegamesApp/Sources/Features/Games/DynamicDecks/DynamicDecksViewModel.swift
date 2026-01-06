import SwiftUI
import Combine

/// ViewModel for Dynamic Decks game logic
@MainActor
class DynamicDecksViewModel: ObservableObject {
    // MARK: - Published Properties
    @Published var players: [Player]
    @Published var currentPlayerIndex = 0
    @Published var clueGiverIndex = 0
    @Published var currentRound = 1
    @Published var timer: Int
    @Published var phase: GameState.GamePhase = .instructions
    @Published var currentCard: Card?
    @Published var roundScore = 0
    @Published var skipsUsed = 0
    @Published var cardsInRound = 0
    
    // MARK: - Configuration
    let difficulty: GameState.Difficulty
    let gameMode: GameState.GameMode
    let maxRounds: Int
    let timerSeconds: Int
    
    // MARK: - Private
    private var cards: [Card] = []
    private var usedCardIds: Set<String> = []
    private var timerCancellable: AnyCancellable?
    
    // MARK: - Computed
    var currentClueGiver: Player {
        players[clueGiverIndex % players.count]
    }
    
    // MARK: - Initialization
    init(players: [Player], difficulty: GameState.Difficulty, gameMode: GameState.GameMode, maxRounds: Int, timerSeconds: Int) {
        self.players = players
        self.difficulty = difficulty
        self.gameMode = gameMode
        self.maxRounds = maxRounds
        self.timerSeconds = timerSeconds
        self.timer = timerSeconds
        
        loadCards()
    }
    
    // MARK: - Card Loading
    private func loadCards() {
        // Bundled card data - matches web app's classic deck
        cards = [
            Card(id: "1", word: "Birthday", forbidden: ["Cake", "Party", "Celebrate", "Gift", "Candles"], points: 1, color: .yellow, difficulty: "easy", clue: nil, answer: nil),
            Card(id: "2", word: "Computer", forbidden: ["Screen", "Keyboard", "Mouse", "Technology", "Internet"], points: 1, color: .yellow, difficulty: "easy", clue: nil, answer: nil),
            Card(id: "3", word: "Elephant", forbidden: ["Trunk", "Big", "Gray", "Africa", "Zoo"], points: 1, color: .yellow, difficulty: "easy", clue: nil, answer: nil),
            Card(id: "4", word: "Guitar", forbidden: ["Music", "Strings", "Play", "Rock", "Instrument"], points: 1, color: .yellow, difficulty: "easy", clue: nil, answer: nil),
            Card(id: "5", word: "Hospital", forbidden: ["Doctor", "Nurse", "Sick", "Medical", "Emergency"], points: 1, color: .yellow, difficulty: "easy", clue: nil, answer: nil),
            Card(id: "6", word: "Vacation", forbidden: ["Travel", "Beach", "Relax", "Holiday", "Trip"], points: 2, color: .blue, difficulty: "medium", clue: nil, answer: nil),
            Card(id: "7", word: "Dinosaur", forbidden: ["Extinct", "Prehistoric", "T-Rex", "Fossil", "Jurassic"], points: 2, color: .blue, difficulty: "medium", clue: nil, answer: nil),
            Card(id: "8", word: "Astronaut", forbidden: ["Space", "NASA", "Moon", "Rocket", "Suit"], points: 2, color: .blue, difficulty: "medium", clue: nil, answer: nil),
            Card(id: "9", word: "Earthquake", forbidden: ["Shake", "Ground", "Disaster", "Fault", "Richter"], points: 2, color: .blue, difficulty: "medium", clue: nil, answer: nil),
            Card(id: "10", word: "Democracy", forbidden: ["Vote", "Government", "Freedom", "Election", "People"], points: 3, color: .green, difficulty: "hard", clue: nil, answer: nil),
            Card(id: "11", word: "Philosophy", forbidden: ["Think", "Wisdom", "Plato", "Question", "Life"], points: 3, color: .green, difficulty: "hard", clue: nil, answer: nil),
            Card(id: "12", word: "Cryptocurrency", forbidden: ["Bitcoin", "Digital", "Money", "Blockchain", "Mining"], points: 3, color: .green, difficulty: "hard", clue: nil, answer: nil),
            Card(id: "13", word: "Procrastination", forbidden: ["Delay", "Later", "Lazy", "Avoid", "Tomorrow"], points: 3, color: .green, difficulty: "hard", clue: nil, answer: nil),
            Card(id: "14", word: "Photosynthesis", forbidden: ["Plant", "Sun", "Oxygen", "Green", "Leaf"], points: 3, color: .red, difficulty: "hard", clue: nil, answer: nil),
            Card(id: "15", word: "Renaissance", forbidden: ["Art", "Italy", "Rebirth", "Leonardo", "Painting"], points: 3, color: .red, difficulty: "hard", clue: nil, answer: nil),
            Card(id: "16", word: "Pizza", forbidden: ["Italy", "Cheese", "Pepperoni", "Slice", "Dough"], points: 1, color: .yellow, difficulty: "easy", clue: nil, answer: nil),
            Card(id: "17", word: "Rainbow", forbidden: ["Colors", "Rain", "Arc", "Sky", "Pot"], points: 1, color: .yellow, difficulty: "easy", clue: nil, answer: nil),
            Card(id: "18", word: "Movie", forbidden: ["Film", "Cinema", "Actor", "Watch", "Hollywood"], points: 1, color: .yellow, difficulty: "easy", clue: nil, answer: nil),
            Card(id: "19", word: "Bicycle", forbidden: ["Wheels", "Pedal", "Ride", "Chain", "Helmet"], points: 1, color: .yellow, difficulty: "easy", clue: nil, answer: nil),
            Card(id: "20", word: "Butterfly", forbidden: ["Wings", "Caterpillar", "Fly", "Colorful", "Insect"], points: 2, color: .blue, difficulty: "medium", clue: nil, answer: nil)
        ]
    }
    
    // MARK: - Game Flow
    func startRound() {
        phase = .playing
        roundScore = 0
        cardsInRound = 0
        skipsUsed = 0
        timer = timerSeconds
        
        drawNextCard()
        startTimer()
    }
    
    func nextRound() {
        currentRound += 1
        clueGiverIndex = (clueGiverIndex + 1) % players.count
        phase = .instructions
    }
    
    func endGame() {
        stopTimer()
        phase = .gameOver
    }
    
    func endTurn() {
        stopTimer()
        
        // Award points to clue giver in classic mode
        if gameMode == .classic {
            players[clueGiverIndex].score += roundScore
        }
        
        if currentRound >= maxRounds {
            phase = .gameOver
        } else {
            phase = .turnEnded
        }
    }
    
    // MARK: - Card Actions
    func correctAnswer() {
        guard let card = currentCard else { return }
        
        roundScore += card.points
        cardsInRound += 1
        usedCardIds.insert(card.id)
        
        drawNextCard()
    }
    
    func skipCard() {
        guard let card = currentCard else { return }
        
        skipsUsed += 1
        usedCardIds.insert(card.id)
        
        drawNextCard()
    }
    
    private func drawNextCard() {
        let availableCards = cards.filter { card in
            !usedCardIds.contains(card.id) && matchesDifficulty(card)
        }
        
        if availableCards.isEmpty {
            // Reset used cards if we run out
            usedCardIds.removeAll()
            currentCard = cards.filter { matchesDifficulty($0) }.randomElement()
        } else {
            currentCard = availableCards.randomElement()
        }
    }
    
    private func matchesDifficulty(_ card: Card) -> Bool {
        switch difficulty {
        case .easy:
            return card.difficulty == "easy"
        case .medium:
            return card.difficulty == "medium"
        case .hard:
            return card.difficulty == "hard"
        case .random:
            return true
        }
    }
    
    // MARK: - Timer
    private func startTimer() {
        timerCancellable = Timer.publish(every: 1, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                guard let self = self else { return }
                
                if self.timer > 0 {
                    self.timer -= 1
                } else {
                    self.endTurn()
                }
            }
    }
    
    private func stopTimer() {
        timerCancellable?.cancel()
        timerCancellable = nil
    }
}
