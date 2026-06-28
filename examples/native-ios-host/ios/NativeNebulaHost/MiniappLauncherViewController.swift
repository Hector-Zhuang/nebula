import SwiftUI
import NebulaHost

struct MiniappLauncherView: View {
  @State private var selectedTab = 0
  @State private var activeMiniappID: String?
  @State private var errorMessage: String?

  var body: some View {
    TabView(selection: $selectedTab) {
      HomeView(open: open).tabItem { Label("Home", systemImage: "house.fill") }.tag(0)
      ServicesView(open: open).tabItem { Label("Services", systemImage: "square.grid.2x2.fill") }.tag(1)
      ActivityView().tabItem { Label("Activity", systemImage: "bell.fill") }.tag(2)
      ProfileView().tabItem { Label("Profile", systemImage: "person.fill") }.tag(3)
    }
    .tint(.blue)
    .alert("Service Unavailable", isPresented: Binding(get: { errorMessage != nil }, set: { if !$0 { errorMessage = nil } })) {
      Button("OK", role: .cancel) {}
    } message: {
      Text(errorMessage ?? "")
    }
  }

  private func open(_ miniapp: MiniappCatalogItem) {
    guard activeMiniappID == nil else { return }
    activeMiniappID = miniapp.id
    guard let navigationController = AppDelegate.navigationController else {
      errorMessage = "The host navigation stack is unavailable."
      activeMiniappID = nil
      return
    }
    navigationController.setNavigationBarHidden(false, animated: false)
    NebulaHost.shared.openApp(miniapp.id, from: navigationController.topViewController ?? navigationController, initialProps: miniapp.initialProps) { error in
      DispatchQueue.main.async {
        activeMiniappID = nil
        if let error { errorMessage = error.localizedDescription }
      }
    }
  }
}

private struct HomeView: View {
  let open: (MiniappCatalogItem) -> Void

  var body: some View {
    NavigationStack {
      ScrollView {
        VStack(alignment: .leading, spacing: 24) {
          HStack {
            VStack(alignment: .leading, spacing: 4) {
              Text("Good morning, Alex").font(.title2.bold())
              Text("Everything you need, in one place").foregroundStyle(.secondary)
            }
            Spacer()
            Image(systemName: "person.crop.circle.fill").font(.system(size: 38)).foregroundStyle(.blue)
          }
          AccountCard()
          VStack(alignment: .leading, spacing: 14) {
            Text("Quick actions").font(.headline)
            LazyVGrid(columns: Array(repeating: GridItem(.flexible()), count: 4), spacing: 18) {
              ForEach(MiniappCatalog.featured) { item in
                Button { open(item) } label: {
                  VStack(spacing: 8) {
                    Image(systemName: item.symbol).font(.title3).frame(width: 44, height: 44).background(item.color.opacity(0.14), in: RoundedRectangle(cornerRadius: 12)).foregroundStyle(item.color)
                    Text(item.name).font(.caption).foregroundStyle(.primary).lineLimit(1)
                  }
                }.buttonStyle(.plain)
              }
            }
          }
          VStack(alignment: .leading, spacing: 12) {
            Text("Recommended for you").font(.headline)
            ForEach(MiniappCatalog.recommended) { item in MiniappRow(item: item, open: open) }
          }
        }.padding()
      }
      .background(Color(uiColor: .systemGroupedBackground))
    }
  }
}

private struct ServicesView: View {
  let open: (MiniappCatalogItem) -> Void
  var body: some View {
    NavigationStack {
      List { Section("Everyday services") { ForEach(MiniappCatalog.all) { item in MiniappRow(item: item, open: open) } } }
        .navigationTitle("Services")
    }
  }
}

private struct MiniappRow: View {
  let item: MiniappCatalogItem
  let open: (MiniappCatalogItem) -> Void
  var body: some View {
    Button { open(item) } label: {
      HStack(spacing: 14) {
        Image(systemName: item.symbol).font(.title3).frame(width: 44, height: 44).background(item.color.opacity(0.14), in: RoundedRectangle(cornerRadius: 12)).foregroundStyle(item.color)
        VStack(alignment: .leading, spacing: 3) {
          Text(item.name).font(.body.weight(.semibold)).foregroundStyle(.primary)
          Text(item.subtitle).font(.caption).foregroundStyle(.secondary)
        }
        Spacer()
        Image(systemName: "chevron.right").font(.caption.weight(.semibold)).foregroundStyle(.tertiary)
      }.padding(.vertical, 3)
    }.buttonStyle(.plain)
  }
}

private struct AccountCard: View {
  var body: some View {
    VStack(alignment: .leading, spacing: 18) {
      Text("Acme balance").font(.subheadline).foregroundStyle(.white.opacity(0.8))
      Text("$2,480.60").font(.system(size: 34, weight: .bold)).foregroundStyle(.white)
      HStack { Text("**** 1842"); Spacer(); Text("Available") }.font(.caption.weight(.medium)).foregroundStyle(.white.opacity(0.82))
    }.padding(20).frame(maxWidth: .infinity, alignment: .leading).background(Color.blue.gradient, in: RoundedRectangle(cornerRadius: 18))
  }
}

private struct ActivityView: View {
  var body: some View {
    NavigationStack {
      VStack(spacing: 12) {
        Image(systemName: "checkmark.circle").font(.system(size: 44)).foregroundStyle(.green)
        Text("All caught up").font(.headline)
        Text("Your latest service updates will appear here.").font(.subheadline).foregroundStyle(.secondary)
      }
      .multilineTextAlignment(.center)
      .padding()
      .navigationTitle("Activity")
    }
  }
}

private struct ProfileView: View {
  var body: some View {
    NavigationStack { List { Section { Label("Alex Morgan", systemImage: "person.crop.circle.fill") }; Section { Label("Settings", systemImage: "gearshape"); Label("Help and support", systemImage: "questionmark.circle") } }.navigationTitle("Profile") }
  }
}

private struct MiniappCatalogItem: Identifiable {
  let id: String
  let name: String
  let subtitle: String
  let symbol: String
  let color: Color
  let initialProps: [String: Any]
}

private enum MiniappCatalog {
  static let all = [
    MiniappCatalogItem(id: "superapp-travel", name: "Travel", subtitle: "Flights, hotels and trip updates", symbol: "airplane", color: .orange, initialProps: ["entry": "home"]),
    MiniappCatalogItem(id: "com.acme.rewards", name: "Rewards", subtitle: "Offers and member benefits", symbol: "gift.fill", color: .pink, initialProps: ["source": "native_home"]),
    MiniappCatalogItem(id: "com.acme.calculator", name: "Calculator", subtitle: "Plan a purchase with monthly payments", symbol: "function", color: .indigo, initialProps: ["currency": "USD"]),
    MiniappCatalogItem(id: "com.acme.support", name: "Support", subtitle: "Get help with your account", symbol: "message.fill", color: .green, initialProps: ["channel": "in_app"]),
  ]
  static let featured = Array(all.prefix(4))
  static let recommended = Array(all.dropFirst(1).prefix(2))
}
