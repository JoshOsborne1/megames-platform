import SwiftUI

/// Root view handling navigation between auth and main app
struct RootView: View {
    @EnvironmentObject var appState: AppState
    
    var body: some View {
        Group {
            if appState.isLoading {
                LoadingView()
            } else if appState.isAuthenticated {
                MainTabView()
            } else {
                AuthView()
            }
        }
        .animation(.easeInOut(duration: 0.3), value: appState.isAuthenticated)
    }
}

#Preview {
    RootView()
        .environmentObject(AppState())
}
