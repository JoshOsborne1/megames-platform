import SwiftUI

/// Typography system matching web app design
extension Font {
    // Display fonts
    static let megamesTitle = Font.system(size: 32, weight: .bold, design: .rounded)
    static let megamesHeadline = Font.system(size: 24, weight: .semibold, design: .rounded)
    static let megamesSubheadline = Font.system(size: 20, weight: .medium, design: .rounded)
    
    // Body fonts
    static let megamesBody = Font.system(size: 16, weight: .regular)
    static let megamesBodyBold = Font.system(size: 16, weight: .semibold)
    
    // Caption fonts
    static let megamesCaption = Font.system(size: 14, weight: .regular)
    static let megamesCaptionBold = Font.system(size: 14, weight: .medium)
    
    // Small fonts
    static let megamesSmall = Font.system(size: 12, weight: .regular)
    
    // Game-specific fonts
    static let megamesScore = Font.system(size: 48, weight: .bold, design: .monospaced)
    static let megamesTimer = Font.system(size: 64, weight: .bold, design: .monospaced)
    static let megamesCardWord = Font.system(size: 28, weight: .bold, design: .rounded)
}

/// Spacing constants for consistent layouts
enum Spacing {
    static let xxs: CGFloat = 4
    static let xs: CGFloat = 8
    static let sm: CGFloat = 12
    static let md: CGFloat = 16
    static let lg: CGFloat = 24
    static let xl: CGFloat = 32
    static let xxl: CGFloat = 48
}

/// Corner radius constants
enum CornerRadius {
    static let small: CGFloat = 8
    static let medium: CGFloat = 12
    static let large: CGFloat = 16
    static let xl: CGFloat = 24
}
