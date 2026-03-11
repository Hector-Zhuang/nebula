import UIKit
import React

final class RNInstanceViewController: UIViewController {
  private let moduleName: String
  private let initialProperties: [AnyHashable: Any]?

  init(moduleName: String, initialProperties: [AnyHashable: Any]? = nil, title: String? = nil) {
    self.moduleName = moduleName
    self.initialProperties = initialProperties
    super.init(nibName: nil, bundle: nil)
    self.title = title ?? moduleName
  }

  @available(*, unavailable)
  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func loadView() {
    guard let rootViewFactory = AppDelegate.sharedRootViewFactory else {
      view = UIView()
      view.backgroundColor = .systemBackground
      return
    }

    let rootView = rootViewFactory.view(
      withModuleName: moduleName,
      initialProperties: initialProperties
    )
    rootView.backgroundColor = .systemBackground
    view = rootView
  }
}
