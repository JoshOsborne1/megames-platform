import SwiftUI

/// Design system colors matching the web app's dark theme
extension Color {
    // Primary brand colors
    static let megamesAccent = Color(hex: "00f5ff")    // Cyan accent
    static let megamesPrimary = Color(hex: "6366f1")   // Indigo
    static let megamesSecondary = Color(hex: "8b5cf6") // Purple
    
    // Background colors
    static let megamesBackground = Color(hex: "0a0a0b")
    static let megamesSurface = Color(hex: "141416")
    static let megamesSurfaceElevated = Color(hex: "1c1c1f")
    static let megamesCard = Color(hex: "18181b")
    
    // Text colors
    static let megamesTextPrimary = Color.white
    static let megamesTextSecondary = Color(hex: "a1a1aa")
    static let megamesTextMuted = Color(hex: "71717a")
    
    // Game card colors
    static let cardYellow = Color(hex: "fbbf24")
    static let cardBlue = Color(hex: "3b82f6")
    static let cardGreen = Color(hex: "22c55e")
    static let cardRed = Color(hex: "ef4444")
    
    // Utility
    static let megamesSuccess = Color(hex: "22c55e")
    static let megamesWarning = Color(hex: "f59e0b")
    static let megamesError = Color(hex: "ef4444")
}

// MARK: - Hex Color Extension
extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}
