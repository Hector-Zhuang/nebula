package com.hectorzhuang.nebula

import android.app.Activity
import android.app.Application
import android.content.pm.ApplicationInfo
import android.os.Bundle
import android.preference.PreferenceManager
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactPackage
import java.net.URL
import java.util.concurrent.Executors
import org.json.JSONObject

interface NebulaHostDelegate {
  fun isDebugBuild(): Boolean = false

  fun createMiniAppPackages(application: Application): List<ReactPackage> = emptyList()
}

object NebulaHost {
  private lateinit var application: Application
  private var delegate: NebulaHostDelegate? = null
  @Volatile private var topActivity: Activity? = null
  @Volatile private var hostModalActivity: Activity? = null
  private val ioExecutor = Executors.newSingleThreadExecutor()

  fun initialize(app: Application, delegate: NebulaHostDelegate? = null) {
    application = app
    this.delegate = delegate
    NebulaConfig.initialize(app)
    NebulaAppManager.initialize(app, delegate)
    app.registerActivityLifecycleCallbacks(
      object : Application.ActivityLifecycleCallbacks {
        override fun onActivityCreated(activity: Activity, savedInstanceState: Bundle?) = Unit
        override fun onActivityStarted(activity: Activity) = Unit
        override fun onActivityResumed(activity: Activity) {
          topActivity = activity
        }
        override fun onActivityPaused(activity: Activity) = Unit
        override fun onActivityStopped(activity: Activity) = Unit
        override fun onActivitySaveInstanceState(activity: Activity, outState: Bundle) = Unit
        override fun onActivityDestroyed(activity: Activity) {
          if (topActivity === activity) {
            topActivity = null
          }
        }
      },
    )
  }

  fun currentActivity(): Activity? = topActivity

  fun presentedHostModalActivity(): Activity? = hostModalActivity

  fun setPresentedHostModalActivity(activity: Activity?) {
    hostModalActivity = activity
  }

  fun isDebugBuild(): Boolean =
    delegate?.isDebugBuild()
      ?: ((application.applicationInfo.flags and ApplicationInfo.FLAG_DEBUGGABLE) != 0)

  fun createMiniAppPackages(): List<ReactPackage> = delegate?.createMiniAppPackages(application) ?: emptyList()

  fun resolveHostReactHost(app: Application = application): ReactHost {
    return when (app) {
      is ReactApplication -> app.reactHost ?: error("ReactApplication.reactHost is null")
      else -> error("Application does not implement ReactApplication")
    }
  }

  fun installApp(
    appId: String,
    bundleURL: String,
    connectToURLMetroServer: Boolean = false,
  ): NebulaInstalledApp {
    val installedApp = NebulaConfig.installApp(appId, bundleURL, connectToURLMetroServer)
    NebulaAppManager.invalidate(appId)
    return installedApp
  }

  fun preloadApp(appId: String) {
    NebulaAppManager.preload(appId)
  }

  fun closeApp(appId: String) {
    NebulaRouter.closeApp(appId).getOrThrow()
  }

  fun uninstallApp(appId: String) {
    NebulaAppManager.invalidate(appId)
    NebulaConfig.clearApp(appId)
  }

  fun openApp(activity: Activity, appId: String, initialProps: Map<String, Any?> = emptyMap()) {
    val routePath =
      NebulaManifestManager.getManifest(appId)?.entryPagePath
        ?: NebulaManifestManager.loadManifest(appId, NebulaConfig.sandboxDir(appId))?.entryPagePath
        ?: "/"
    NebulaRouter.openApp(activity, appId, routePath, initialProps)
  }

  fun installedApps(): List<String> = NebulaConfig.installedAppIds()

  fun handleIncomingUrl(activity: Activity, url: android.net.Uri?): Boolean {
    if (url == null) {
      return false
    }
    val isInstallLink =
      (url.host == "review" && url.path.orEmpty().startsWith("/install/")) ||
      (url.host == "miniapp" && url.path.orEmpty().startsWith("/install/")) ||
      url.path.orEmpty().startsWith("/review/install/")
    if (!isInstallLink) {
      return false
    }

    val pathSegments = url.pathSegments.orEmpty()
    val installIdx = pathSegments.indexOf("install")
    val pathId = if (installIdx >= 0 && installIdx + 1 < pathSegments.size) {
      pathSegments[installIdx + 1]
    } else {
      ""
    }

    val installUrl = url.getQueryParameter("installUrl")
    if (installUrl != null) {
      ioExecutor.execute {
        runCatching {
          val resolvedInstallUrl = NebulaConfig.resolveRemoteUrl(installUrl)
          val payload = JSONObject(URL(resolvedInstallUrl).readText())
          val appId = payload.getString("appId")
          val bundles = payload.optJSONObject("bundles")
          val rawBundleUrl =
            bundles?.optString("android")?.takeIf { it.isNotBlank() }
              ?: payload.optString("bundleUrl").takeIf { it.isNotBlank() }
              ?: error("Missing Android bundle URL in review install payload")
          val bundleUrl = NebulaConfig.resolveRemoteUrl(rawBundleUrl)
          val manifestUrl = NebulaConfig.resolveRemoteUrl(payload.getString("manifestUrl"))
          val assetsUrl =
              payload.optJSONObject("assetsUrl")?.optString("android")?.takeIf { it.isNotBlank() }
              ?: error("Missing Android assets URL in review install payload")
          val resolvedAssetsUrl = NebulaConfig.resolveRemoteUrl(assetsUrl)
          NebulaConfig.installApp(appId, bundleUrl, manifestUrl, resolvedAssetsUrl, false)
          activity.runOnUiThread {
            openApp(activity, appId)
          }
        }.onFailure { error ->
          error.printStackTrace()
        }
      }
      return true
    }

    if (pathId.isEmpty()) {
      return false
    }
    val releaseInstallPath = "/api/mini-apps/access/apps/$pathId/release/install"
    val resolvedReleaseUrl = NebulaConfig.resolveRemoteUrl(releaseInstallPath)
    ioExecutor.execute {
      runCatching {
        val payload = JSONObject(URL(resolvedReleaseUrl).readText())
        val appId = payload.getString("appId")
        val bundles = payload.optJSONObject("bundles")
        val rawBundleUrl =
          bundles?.optString("android")?.takeIf { it.isNotBlank() }
            ?: error("Missing Android bundle URL in release install payload")
        val bundleUrl = NebulaConfig.resolveRemoteUrl(rawBundleUrl)
        val manifestUrl = NebulaConfig.resolveRemoteUrl(payload.getString("manifestUrl"))
        val assetsUrl =
          payload.optJSONObject("assetsUrl")?.optString("android")?.takeIf { it.isNotBlank() }
            ?: error("Missing Android assets URL in release install payload")
        val resolvedAssetsUrl = NebulaConfig.resolveRemoteUrl(assetsUrl)
        NebulaConfig.installApp(appId, bundleUrl, manifestUrl, resolvedAssetsUrl, false)
        activity.runOnUiThread {
          openApp(activity, appId)
        }
      }.onFailure { error ->
        error.printStackTrace()
      }
    }
    return true
  }
}
