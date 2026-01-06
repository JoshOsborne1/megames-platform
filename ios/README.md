# Megames iOS App

Native iOS app for the Megames party games platform, built with Swift and SwiftUI.

## Requirements

- **Xcode 15+** (macOS only)
- **iOS 16.0+** deployment target
- **Swift 5.9+**

## Setup Instructions

### 1. Open in Xcode

```bash
cd ios/MegamesApp
open MegamesApp.xcodeproj
```

### 2. Install Dependencies

The app uses Swift Package Manager. Xcode will automatically resolve dependencies when you open the project.

**Dependencies:**
- [Supabase Swift SDK](https://github.com/supabase/supabase-swift) - Backend connectivity

### 3. Configure Signing

1. Open the project in Xcode
2. Select the MegamesApp target
3. Go to "Signing & Capabilities"
4. Select your Team
5. Update the Bundle Identifier if needed

### 4. Run the App

- Select an iPhone simulator or connected device
- Press `Cmd + R` to build and run

## Project Structure

```
MegamesApp/
├── Sources/
│   ├── App/                    # App entry point and root views
│   ├── Core/
│   │   ├── Networking/         # Supabase client and realtime
│   │   └── Models/             # Game data models
│   ├── Features/
│   │   ├── Auth/               # Login/signup views
│   │   ├── Home/               # Home screen and navigation
│   │   ├── Games/              # Game list and gameplay
│   │   │   └── DynamicDecks/   # Dynamic Decks game implementation
│   │   ├── Multiplayer/        # Lobby management
│   │   └── Profile/            # User profile and settings
│   ├── Shared/
│   │   ├── Components/         # Reusable UI components
│   │   └── Theme/              # Colors, typography, spacing
│   └── Resources/              # Info.plist, assets
└── Package.swift               # SPM manifest
```

## Feature Overview

### Games Available
- **Dynamic Decks** - Word guessing game with forbidden words
- **Lyric Legends** - Complete the lyrics challenge
- **Lyric Echoes** - Rhyming word puzzles
- **Shade Signals** - Color matching game

### Multiplayer
- Create and join lobbies with room codes
- Real-time player tracking via Supabase Realtime
- Cross-platform play with web users

### Content Updates
Since this uses **Option B (Bundled Content)**, new game content requires an app update via TestFlight or App Store.

## Development Workflow

### Making Content Updates

1. Edit content in the web app
2. Test thoroughly on web
3. Update bundled content in `DynamicDecksViewModel.swift`
4. Build new version in Xcode
5. Upload to TestFlight for testing
6. Submit to App Store when ready

### TestFlight Distribution

1. Archive the app: `Product → Archive`
2. Distribute to App Store Connect
3. Enable TestFlight testing
4. Invite beta testers

## Configuration

### Supabase Credentials

The app shares the same Supabase project as the web app. Credentials are in `SupabaseManager.swift`:

```swift
let supabaseURL = URL(string: "https://bowzeihdsmqgxdtdewip.supabase.co")!
let supabaseKey = "your-anon-key"
```

## Building for Release

1. Set version number in `Info.plist`
2. Select "Any iOS Device (arm64)"
3. `Product → Archive`
4. `Distribute App → App Store Connect`

## License

Proprietary - Megames Platform
