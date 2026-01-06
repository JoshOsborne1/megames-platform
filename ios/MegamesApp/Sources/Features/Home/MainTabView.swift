import SwiftUI

/// Main tab navigation view
struct MainTabView: View {
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Label("Home", systemImage: "house.fill")
                }
                .tag(0)
            
            GamesListView()
                .tabItem {
                    Label("Games", systemImage: "gamecontroller.fill")
                }
                .tag(1)
            
            LobbiesView()
                .tabItem {
                    Label("Lobbies", systemImage: "person.2.fill")
                }
                .tag(2)
            
            ProfileView()
                .tabItem {
                    Label("Profile", systemImage: "person.circle.fill")
                }
                .tag(3)
        }
        .tint(.megamesAccent)
    }
}

#Preview {
    MainTabView()
        .environmentObject(AppState())
}
