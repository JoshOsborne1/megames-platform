import SwiftUI

/// Loading view with animated spinner
struct LoadingView: View {
    var message: String = "Loading..."
    
    var body: some View {
        ZStack {
            Color.megamesBackground
                .ignoresSafeArea()
            
            VStack(spacing: Spacing.lg) {
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .megamesAccent))
                    .scaleEffect(1.5)
                
                Text(message)
                    .font(.megamesCaption)
                    .foregroundColor(.megamesTextSecondary)
            }
        }
    }
}

/// Card container component
struct CardView<Content: View>: View {
    let content: Content
    var padding: CGFloat = Spacing.md
    
    init(padding: CGFloat = Spacing.md, @ViewBuilder content: () -> Content) {
        self.padding = padding
        self.content = content()
    }
    
    var body: some View {
        content
            .padding(padding)
            .background(Color.megamesCard)
            .clipShape(RoundedRectangle(cornerRadius: CornerRadius.large))
            .overlay(
                RoundedRectangle(cornerRadius: CornerRadius.large)
                    .stroke(Color.white.opacity(0.05), lineWidth: 1)
            )
    }
}

/// Game card display for Dynamic Decks
struct GameCardView: View {
    let word: String
    let forbidden: [String]
    let color: CardColor
    let points: Int
    
    var body: some View {
        VStack(spacing: Spacing.lg) {
            // Points badge
            HStack {
                Spacer()
                Text("\(points)x")
                    .font(.megamesCaptionBold)
                    .foregroundColor(.white)
                    .padding(.horizontal, Spacing.sm)
                    .padding(.vertical, Spacing.xxs)
                    .background(Color.black.opacity(0.3))
                    .clipShape(Capsule())
            }
            
            Spacer()
            
            // Main word
            Text(word)
                .font(.megamesCardWord)
                .foregroundColor(.white)
                .multilineTextAlignment(.center)
            
            Spacer()
            
            // Forbidden words
            VStack(spacing: Spacing.xs) {
                ForEach(forbidden, id: \.self) { forbiddenWord in
                    HStack {
                        Image(systemName: "xmark")
                            .font(.system(size: 10, weight: .bold))
                        Text(forbiddenWord)
                            .font(.megamesCaption)
                    }
                    .foregroundColor(.white.opacity(0.8))
                }
            }
        }
        .padding(Spacing.lg)
        .frame(maxWidth: .infinity)
        .aspectRatio(0.65, contentMode: .fit)
        .background(
            LinearGradient(
                colors: [color.color, color.color.opacity(0.8)],
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
        .clipShape(RoundedRectangle(cornerRadius: CornerRadius.xl))
        .shadow(color: color.color.opacity(0.4), radius: 20, y: 10)
    }
}

enum CardColor {
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

#Preview {
    VStack {
        GameCardView(
            word: "Programming",
            forbidden: ["Code", "Computer", "Type", "Software", "Language"],
            color: .blue,
            points: 2
        )
        .frame(width: 280)
    }
    .padding()
    .background(Color.megamesBackground)
}
