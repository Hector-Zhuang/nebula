import Foundation

public enum NebulaURLType: Int {
    case install = 2
    // case open
}

public final class NebulaURLParser {
    public static let shared = NebulaURLParser()
    
    public func handleIncomingUrl(url: URL, viewController: UIViewController?) -> Bool {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
            return false
        }
        
        guard let urlType = parseUrlType(components: components) else {
            return false
        }
        
        switch urlType {
        case .install:
            return handleInstallUrl(url: url, viewController: viewController)
        }
    }
    
    private func handleInstallUrl(url: URL, viewController: UIViewController?) -> Bool {
        guard let pathId = extractAppId(from: url) else {
            return false
        }

        if let installUrl = extractInstallUrl(from: url) {
            NebulaHost.shared.installReviewBuild(from: installUrl, presenter: viewController)
            return true
        }
        
        let releaseInstallPath = "/api/mini-apps/access/apps/\(pathId)/release/install"
        NebulaHost.shared.installReviewBuild(from: releaseInstallPath, presenter: viewController)
        return true
    }
    
    private func parseUrlType(components: URLComponents) -> NebulaURLType? {
        let isInstallLink = isInstallUrl(components: components)
        
        return isInstallLink ? NebulaURLType.install : nil
    }
    
    private func isInstallUrl(components: URLComponents) -> Bool {
        return (components.host == "review" && components.path.hasPrefix("/install/")) || (components.host == "miniapp" && components.path.hasPrefix("/install/")) ||
            components.path.hasPrefix("/review/install")
    }
    
    public func extractAppId(from url: URL) -> String? {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
            return nil
        }
        return components.path
            .split(separator: "/")
            .drop(while: { $0 != "install" })
            .dropFirst()
            .first
            .map(String.init)
    }

    public func extractInstallUrl(from url: URL) -> String? {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
            return nil
        }
        return components.queryItems?.first(where: { $0.name == "installurl" })?.value
    }
    
    public func isValidNebulaUrl(_ url: URL) -> Bool {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false) else {
            return false
        }
        return components.scheme == "nebula"
    }
}
 
