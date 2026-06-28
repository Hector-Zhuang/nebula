package com.hectorzhuang.nebula

import android.app.Activity
import android.app.Application
import android.os.Bundle
import com.facebook.react.ReactHost
import com.facebook.react.ReactInstanceEventListener
import com.facebook.react.ReactPackage
import com.facebook.react.defaults.DefaultComponentsRegistry
import com.facebook.react.defaults.DefaultReactHostDelegate
import com.facebook.react.defaults.DefaultTurboModuleManagerDelegate
import com.facebook.react.fabric.ComponentFactory
import com.facebook.react.interfaces.fabric.ReactSurface
import com.facebook.react.runtime.ReactHostImpl
import com.facebook.react.runtime.hermes.HermesInstance
import com.facebook.react.bridge.JSBundleLoader
import java.util.concurrent.ConcurrentHashMap
import com.facebook.react.common.annotations.UnstableReactNativeAPI

@OptIn(UnstableReactNativeAPI::class)
object NebulaAppManager {
  private lateinit var application: Application
  private var delegate: NebulaHostDelegate? = null
  private val hosts = ConcurrentHashMap<String, ReactHost>()

  fun initialize(app: Application, delegate: NebulaHostDelegate? = null) {
    application = app
    this.delegate = delegate
  }

  fun preload(appId: String) {
    acquireHost(appId)
  }

  fun startHost(appId: String, onReady: (() -> Unit)? = null) {
    val host = acquireHost(appId)
    if (onReady == null) {
      host.start()
      return
    }
    if (host.currentReactContext != null) {
      android.os.Handler(android.os.Looper.getMainLooper()).post(onReady)
      return
    }
    val listener = object : ReactInstanceEventListener {
      override fun onReactContextInitialized(context: com.facebook.react.bridge.ReactContext) {
        host.removeReactInstanceEventListener(this)
        onReady()
      }
    }
    host.addReactInstanceEventListener(listener)
    host.start()
  }

  fun invalidate(appId: String) {
    hosts.remove(appId)?.let { host ->
      if (host is ReactHostImpl) {
        host.destroy("NebulaAppManager.invalidate($appId)", null)
      }
    }
  }

  fun invalidateAll() {
    hosts.forEach { (_, host) ->
      if (host is ReactHostImpl) {
        host.destroy("NebulaAppManager.invalidateAll", null)
      }
    }
    hosts.clear()
  }

  fun acquireHost(appId: String): ReactHost {
    hosts[appId]?.let { return it }

    val installedApp =
      NebulaConfig.getInstalledApp(appId)
        ?: error("Mini-app $appId is not installed")
    val enableDevSupport =
      NebulaHost.isDebugBuild() && NebulaConfig.isDevelopmentMode(installedApp)
    val devServerHost = NebulaConfig.getDevServerHost(installedApp)
    val jsMainModulePath =
      NebulaConfig.getDevModulePath(installedApp) ?: "index"

    val packages = (delegate?.createMiniAppPackages(application) ?: emptyList()).toMutableList()
    packages.add(NebulaPackage())
    
    val delegate =
      DefaultReactHostDelegate(
        jsMainModulePath = jsMainModulePath,
        jsBundleLoader = JSBundleLoader.createFileLoader(installedApp.bundlePath),
        reactPackages = packages.distinctBy { it.javaClass.name },
        jsRuntimeFactory = HermesInstance(),
        turboModuleManagerDelegateBuilder = DefaultTurboModuleManagerDelegate.Builder(),
      )

    val componentFactory = ComponentFactory().also { DefaultComponentsRegistry.register(it) }
    val host =
      ReactHostImpl(
        application,
        delegate,
        componentFactory,
        enableDevSupport,
        enableDevSupport,
      )

    if (enableDevSupport && !devServerHost.isNullOrBlank()) {
      host.setBundleSource(devServerHost, jsMainModulePath)
    }

    hosts[appId] = host
    return host
  }

  fun createSurface(appId: String, activity: Activity, moduleName: String, initialProps: Bundle): ReactSurface {
    val host = acquireHost(appId)
    return host.createSurface(activity, moduleName, initialProps)
  }

  fun onHostPause(appId: String, activity: Activity) {
    hosts[appId]?.onHostPause(activity)
  }

  fun onHostResume(appId: String, activity: Activity) {
    hosts[appId]?.onHostResume(activity)
  }

  fun onHostResume(appId: String, activity: Activity, backButtonHandler: com.facebook.react.modules.core.DefaultHardwareBackBtnHandler) {
    hosts[appId]?.onHostResume(activity, backButtonHandler)
  }

  fun onHostDestroy(appId: String, activity: Activity) {
    hosts[appId]?.onHostDestroy(activity)
  }
}
