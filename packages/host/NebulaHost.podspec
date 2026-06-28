require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "NebulaHost"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package.dig("repository", "url")
  s.license      = package["license"]
  s.authors      = package["author"]
  s.platforms    = { :ios => "15.1" }
  s.source       = { :git => package.dig("repository", "url"), :tag => s.version.to_s }

  s.source_files = "ios/Nebula/**/*.{swift,m,h}"
  s.requires_arc = true
  s.swift_version = "5.0"

  s.dependency "React-Core"
  s.dependency "React-RCTAppDelegate"
  s.dependency "ReactAppDependencyProvider"
  s.dependency "ZIPFoundation"
end
