//
//  NebulaPerformanceMonitor.swift
//  SuperApp - Nebula Mini-App Container
//
//  Performance monitoring for mini-app lifecycle
//

import Foundation

@objc public final class NebulaPerformanceMonitor: NSObject {
    
    // MARK: - Singleton
    
    @objc public static let shared = NebulaPerformanceMonitor()
    
    // MARK: - Properties
    
    private var measurements: [String: CFAbsoluteTime] = [:]
    private let queue = DispatchQueue(label: "com.nebula.performance", attributes: .concurrent)
    
    // MARK: - Public API
    
    @objc public func startMeasure(_ key: String) {
        queue.async(flags: .barrier) { [weak self] in
            self?.measurements[key] = CFAbsoluteTimeGetCurrent()
        }
    }
    
    @objc public func endMeasure(_ key: String) {
        queue.async(flags: .barrier) { [weak self] in
            guard let self = self,
                  let startTime = self.measurements[key] else {
                return
            }
            
            let duration = CFAbsoluteTimeGetCurrent() - startTime
            print("[Nebula:Performance] \(key): \(String(format: "%.3f", duration * 1000))ms")
            
            self.measurements.removeValue(forKey: key)
        }
    }
    
    private override init() {
        super.init()
    }
}
