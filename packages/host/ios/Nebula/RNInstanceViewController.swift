import UIKit
import React
import React_RCTAppDelegate

public final class RNInstanceViewController: UIViewController {
    private let moduleName: String
    private let initialProperties: [AnyHashable: Any]?
    private let prefersNavigationBarHidden: Bool
    private weak var rootViewFactory: RCTRootViewFactory?

    public init(
        rootViewFactory: RCTRootViewFactory?,
        moduleName: String,
        initialProperties: [AnyHashable: Any]? = nil,
        title: String? = nil,
        prefersNavigationBarHidden: Bool = false
    ) {
        self.rootViewFactory = rootViewFactory
        self.moduleName = moduleName
        self.initialProperties = initialProperties
        self.prefersNavigationBarHidden = prefersNavigationBarHidden
        super.init(nibName: nil, bundle: nil)
        self.title = title
    }

    @available(*, unavailable)
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    public override func loadView() {
        guard let rootViewFactory else {
            view = UIView()
            view.backgroundColor = .systemBackground
            return
        }

        let rootView = rootViewFactory.view(
            withModuleName: moduleName,
            initialProperties: initialProperties
        )
        let wantsTransparentBackground =
            (initialProperties?["__transparentBackground"] as? Bool) ?? false
        rootView.backgroundColor = wantsTransparentBackground ? .clear : .systemBackground
        view = rootView
    }

    public override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        navigationController?.setNavigationBarHidden(prefersNavigationBarHidden, animated: animated)
    }
}
