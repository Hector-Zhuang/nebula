package com.hectorzhuang.nebula

import android.os.Build
import android.widget.Toast
import android.content.Intent
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class NebulaNativeModule(
    reactContext: ReactApplicationContext,
) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private const val HOST_MESSAGE_EVENT = "NebulaHostMessage"
        private const val MINI_APP_MESSAGE_EVENT = "NebulaMiniAppMessage"
        private const val PAGE_LIFECYCLE_EVENT = "NebulaPageLifecycle"
    }

    private val emitterId = NebulaEventHub.nextEmitterId()
    private var currentRuntimeAppId: String? = null
    private var listenerCount = 0

    init {
        NebulaEventHub.register(this)
    }

    override fun getName(): String = "NebulaNativeModule"

    override fun invalidate() {
        NebulaEventHub.unregister(this)
        super.invalidate()
    }

    @ReactMethod
    fun addListener(eventName: String) {
        listenerCount += 1
    }

    @ReactMethod
    fun removeListeners(count: Double) {
        listenerCount = (listenerCount - count.toInt()).coerceAtLeast(0)
    }

    @ReactMethod
    fun openMiniApp(appId: String, initialProps: ReadableMap?, promise: Promise) {
        val activity = reactApplicationContext.getCurrentActivity() ?: NebulaHost.currentActivity()
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Cannot find an active Activity")
            return
        }
        activity.runOnUiThread {
            runCatching {
                NebulaHost.openApp(activity, appId, initialProps?.toHashMap() ?: emptyMap())
            }.onSuccess {
                promise.resolve(Arguments.makeNativeMap(mapOf("success" to true, "appId" to appId)))
            }.onFailure { error ->
                promise.reject("OPEN_ERROR", error.message, error)
            }
        }
    }

    @ReactMethod
    fun preloadMiniApp(appId: String, promise: Promise) {
        runCatching {
            NebulaHost.preloadApp(appId)
            promise.resolve(Arguments.makeNativeMap(mapOf("success" to true, "appId" to appId)))
        }.onFailure { error ->
            promise.reject("PRELOAD_ERROR", error.message, error)
        }
    }

    @ReactMethod
    fun openMiniAppWithBundleURL(
        appId: String,
        bundleURL: String,
        connectToURLMetroServer: Boolean,
        initialProps: ReadableMap?,
        promise: Promise,
    ) {
        runCatching {
            NebulaHost.installApp(
                appId,
                bundleURL,
                connectToURLMetroServer,
            )
            val activity =
                reactApplicationContext.currentActivity ?: NebulaHost.currentActivity()
                    ?: error("Cannot find an active Activity")
            activity.runOnUiThread {
                NebulaHost.openApp(activity, appId, initialProps?.toHashMap() ?: emptyMap())
                promise.resolve(
                    Arguments.makeNativeMap(
                        mapOf("success" to true, "appId" to appId),
                    ),
                )
            }
        }.onFailure { error ->
            promise.reject("OPEN_ERROR", error.message, error)
        }
    }

    @ReactMethod
    fun preloadMiniAppWithBundleURL(
        appId: String,
        bundleURL: String,
        connectToURLMetroServer: Boolean,
        promise: Promise,
    ) {
        runCatching {
            NebulaHost.installApp(
                appId,
                bundleURL,
                connectToURLMetroServer,
            )
            NebulaHost.preloadApp(appId)
        }.onSuccess {
            promise.resolve(
                Arguments.makeNativeMap(
                    mapOf("success" to true, "appId" to appId),
                ),
            )
        }.onFailure { error ->
            promise.reject("PRELOAD_ERROR", error.message, error)
        }
    }

    @ReactMethod
    fun installMiniApp(appId: String, bundleURL: String, promise: Promise) {
        installMiniAppWithBundleURL(appId, bundleURL, false, promise)
    }

    @ReactMethod
    fun installMiniAppWithBundleURL(
        appId: String,
        bundleURL: String,
        connectToURLMetroServer: Boolean,
        promise: Promise,
    ) {
        runCatching {
            NebulaHost.installApp(
                appId,
                bundleURL,
                connectToURLMetroServer,
            )
        }.onSuccess {
            promise.resolve(
                Arguments.makeNativeMap(
                    mapOf(
                        "success" to true,
                        "appId" to appId,
                    )
                ),
            )
        }.onFailure { error ->
            promise.reject("INSTALL_ERROR", error.message, error)
        }
    }

    @ReactMethod
    fun installMiniAppFromURLs(
        appId: String,
        bundleURL: String,
        manifestURL: String,
        assetsURL: String,
        connectToURLMetroServer: Boolean,
        promise: Promise,
    ) {
        runCatching {
            NebulaConfig.installApp(
                appId,
                bundleURL,
                manifestURL,
                assetsURL,
                connectToURLMetroServer,
            )
            NebulaAppManager.invalidate(appId)
        }.onSuccess {
            promise.resolve(
                Arguments.makeNativeMap(
                    mapOf("success" to true, "appId" to appId),
                ),
            )
        }.onFailure { error ->
            promise.reject("INSTALL_ERROR", error.message, error)
        }
    }

    @ReactMethod
    fun closeMiniApp(appId: String, promise: Promise) {
        val activity = reactApplicationContext.currentActivity ?: NebulaHost.currentActivity()
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Cannot find an active Activity")
            return
        }

        activity.runOnUiThread {
            runCatching {
                NebulaHost.closeApp(appId)
            }.onSuccess {
                promise.resolve(
                    Arguments.makeNativeMap(
                        mapOf("success" to true, "appId" to appId),
                    ),
                )
            }.onFailure { error ->
                promise.reject("CLOSE_ERROR", error.message, error)
            }
        }
    }

    @ReactMethod
    fun uninstallMiniApp(appId: String, promise: Promise) {
        runCatching {
            NebulaHost.uninstallApp(appId)
        }.onSuccess {
            promise.resolve(
                Arguments.makeNativeMap(
                    mapOf("success" to true, "appId" to appId),
                ),
            )
        }.onFailure { error ->
            promise.reject("UNINSTALL_ERROR", error.message, error)
        }
    }

    @ReactMethod
    fun getInstalledMiniApps(promise: Promise) {
        promise.resolve(Arguments.makeNativeMap(mapOf("apps" to NebulaHost.installedApps())))
    }

    @ReactMethod
    fun getInstalledMiniAppInfo(appId: String, promise: Promise) {
        val installedApp = NebulaConfig.getInstalledApp(appId)
        if (installedApp == null) {
            promise.resolve(
                Arguments.makeNativeMap(
                    mapOf(
                        "installed" to false,
                        "app" to null,
                    ),
                ),
            )
            return
        }

        promise.resolve(
            Arguments.makeNativeMap(
                mapOf(
                    "installed" to true,
                    "app" to mapOf(
                        "appId" to installedApp.appId,
                        "mode" to installedApp.mode,
                        "bundlePath" to installedApp.bundlePath,
                        "sourceUrl" to installedApp.sourceUrl,
                        "version" to installedApp.version,
                        "updateStrategy" to installedApp.updateStrategy,
                    ),
                ),
            ),
        )
    }

    @ReactMethod
    fun getServerBaseURL(promise: Promise) {
        promise.resolve(
            Arguments.makeNativeMap(
                mapOf("serverBaseURL" to NebulaConfig.serverBaseURL),
            ),
        )
    }

    @ReactMethod
    fun setServerBaseURL(serverBaseURL: String?, promise: Promise) {
        val trimmedValue = serverBaseURL?.trim().orEmpty()
        if (trimmedValue.isNotEmpty() && NebulaConfig.normalizeServerBaseURL(trimmedValue) == null) {
            promise.reject("INVALID_SERVER_URL", "serverBaseURL must be a valid http(s) URL")
            return
        }
        NebulaConfig.serverBaseURL = trimmedValue.ifEmpty { null }
        promise.resolve(
            Arguments.makeNativeMap(
                mapOf("serverBaseURL" to NebulaConfig.serverBaseURL),
            ),
        )
    }

    @ReactMethod
    fun setMiniappLoadingDelay(delayMs: Double?, promise: Promise) {
        val normalizedDelayMs =
            delayMs
                ?.takeIf { it.isFinite() }
                ?.toLong()
                ?.coerceAtLeast(0L)
                ?: 0L
        NebulaRouter.setMiniappLoadingDelay(normalizedDelayMs)
        promise.resolve(
            Arguments.makeNativeMap(
                mapOf("delayMs" to normalizedDelayMs.toDouble()),
            ),
        )
    }

    @ReactMethod
    fun setMiniappLoadingEnterContentDelay(delayMs: Double?, promise: Promise) {
        val normalizedDelayMs =
            delayMs
                ?.takeIf { it.isFinite() }
                ?.toLong()
                ?.coerceAtLeast(0L)
                ?: 0L
        NebulaRouter.setMiniappLoadingEnterContentDelay(normalizedDelayMs)
        promise.resolve(
            Arguments.makeNativeMap(
                mapOf("delayMs" to normalizedDelayMs.toDouble()),
            ),
        )
    }

    @ReactMethod
    fun setMiniappLoadingEnabled(enabled: Boolean, promise: Promise) {
        NebulaRouter.setMiniappLoadingEnabled(enabled)
        promise.resolve(
            Arguments.makeNativeMap(
                mapOf("enabled" to enabled),
            ),
        )
    }

    @ReactMethod
    fun registerRoutes(appId: String, routes: ReadableMap, promise: Promise) {
        val pages =
            routes.toHashMap().mapValues { it.value?.toString().orEmpty() }
                .filterValues { it.isNotBlank() }
        currentRuntimeAppId = appId
        NebulaManifestManager.registerRoutes(appId, pages)
        promise.resolve(
            Arguments.makeNativeMap(
                mapOf(
                    "success" to true,
                    "appId" to appId,
                    "count" to pages.size
                )
            )
        )
    }

    @ReactMethod
    fun registerManifest(appId: String, manifest: ReadableMap, promise: Promise) {
        runCatching {
            val map = manifest.toHashMap()
      val pages =
        (map["pages"] as? Map<*, *>)
          ?.entries
          ?.mapNotNull { entry ->
            val route = entry.key?.toString() ?: return@mapNotNull null
            val componentName = entry.value?.toString() ?: return@mapNotNull null
            route to componentName
          }
          ?.toMap()
          ?: emptyMap<String, String>()
      val pageConfigs =
        (map["pageConfigs"] as? Map<*, *>)
          ?.entries
          ?.mapNotNull { entry ->
            val route = entry.key?.toString() ?: return@mapNotNull null
            @Suppress("UNCHECKED_CAST")
            route to ((entry.value as? Map<String, Any?>) ?: emptyMap<String, Any?>())
          }
          ?.toMap()
          ?: emptyMap<String, Map<String, Any?>>()
      val window = (map["window"] as? Map<String, Any?>) ?: emptyMap<String, Any?>()
            val parsed =
                NebulaManifest(
                    appId = appId,
                    entryPagePath = map["entryPagePath"]?.toString(),
                    pages = pages,
                    pageConfigs = pageConfigs,
                    updateStrategy = map["updateStrategy"]?.toString() ?: "manual",
                    version = map["version"]?.toString(),
                    window = window,
                )
            currentRuntimeAppId = appId
            NebulaManifestManager.registerManifest(appId, parsed)
            NebulaRouter.updatePageStyle(
                appId,
                NebulaManifestManager.getPageConfig(appId, parsed.entryPagePath ?: "/")
            )
            promise.resolve(
                Arguments.makeNativeMap(
                    mapOf(
                        "success" to true,
                        "appId" to appId,
                        "count" to pages.size
                    )
                ),
            )
        }.onFailure { error ->
            promise.reject("INVALID_MANIFEST", error.message, error)
        }
    }

    @ReactMethod
    fun postMessageToHost(appId: String, message: ReadableMap, promise: Promise) {
        currentRuntimeAppId = appId
        NebulaEventHub.publishBridgeMessage(
            NebulaBridgeMessage(
                direction = "toHost",
                appId = appId,
                message = message.toHashMap(),
                sourceEmitterId = emitterId,
                timestamp = System.currentTimeMillis() / 1000.0,
            ),
        )
        promise.resolve(Arguments.makeNativeMap(mapOf("errMsg" to "postMessageToHost:ok")))
    }

    @ReactMethod
    fun postMessageToMiniApp(appId: String, message: ReadableMap, promise: Promise) {
        NebulaEventHub.publishBridgeMessage(
            NebulaBridgeMessage(
                direction = "toMiniApp",
                appId = appId,
                message = message.toHashMap(),
                sourceEmitterId = emitterId,
                timestamp = System.currentTimeMillis() / 1000.0,
            ),
        )
        promise.resolve(Arguments.makeNativeMap(mapOf("errMsg" to "postMessageToMiniApp:ok")))
    }

    @ReactMethod
    fun presentHostModal(moduleName: String, props: ReadableMap?, promise: Promise) {
        val activity = reactApplicationContext.getCurrentActivity() ?: NebulaHost.currentActivity()
        if (activity == null) {
            promise.resolve(Arguments.makeNativeMap(mapOf("errMsg" to "presentHostModal:fail no_activity")))
            return
        }

        activity.runOnUiThread {
            runCatching {
                val intent =
                    NebulaHostModalActivity.createIntent(
                        activity,
                        moduleName,
                        props?.toHashMap() ?: emptyMap(),
                    ).apply {
                        addFlags(Intent.FLAG_ACTIVITY_NO_ANIMATION)
                    }
                activity.startActivity(intent)
                activity.overridePendingTransition(0, 0)
            }.onSuccess {
                promise.resolve(Arguments.makeNativeMap(mapOf("errMsg" to "presentHostModal:ok")))
            }.onFailure { error ->
                promise.reject("PRESENT_HOST_MODAL_ERROR", error.message, error)
            }
        }
    }

    @ReactMethod
    fun dismissHostModal(promise: Promise) {
        val activity = NebulaHost.presentedHostModalActivity()
        if (activity == null) {
            promise.resolve(Arguments.makeNativeMap(mapOf("errMsg" to "dismissHostModal:ok")))
            return
        }

        activity.runOnUiThread {
            runCatching {
                activity.finish()
                activity.overridePendingTransition(0, 0)
            }.onSuccess {
                promise.resolve(Arguments.makeNativeMap(mapOf("errMsg" to "dismissHostModal:ok")))
            }.onFailure { error ->
                promise.reject("DISMISS_HOST_MODAL_ERROR", error.message, error)
            }
        }
    }

    @ReactMethod
    fun navigateTo(appId: String, url: String, promise: Promise) {
        resolveNavigation("navigateTo", promise) { NebulaRouter.navigateToURL(url, appId) }
    }

    @ReactMethod
    fun redirectTo(appId: String, url: String, promise: Promise) {
        resolveNavigation("redirectTo", promise) { NebulaRouter.redirectToURL(url, appId) }
    }

    @ReactMethod
    fun reLaunch(appId: String, url: String, promise: Promise) {
        resolveNavigation("reLaunch", promise) { NebulaRouter.reLaunchURL(url, appId) }
    }

    @ReactMethod
    fun navigateBack(appId: String, delta: Double, promise: Promise) {
        resolveNavigation("navigateBack", promise) {
            NebulaRouter.navigateBack(
                appId,
                delta.toInt()
            )
        }
    }

    @ReactMethod
    fun setPageStyle(appId: String, style: ReadableMap, promise: Promise) {
        resolveNavigation("setPageStyle", promise) {
            NebulaRouter.updatePageStyle(appId, style.toHashMap())
        }
    }

    @ReactMethod
    fun showToast(title: String, promise: Promise) {
        val activity = reactApplicationContext.getCurrentActivity() ?: NebulaHost.currentActivity()
        if (activity == null) {
            promise.resolve(Arguments.makeNativeMap(mapOf("errMsg" to "showToast:fail no_activity")))
            return
        }
        activity.runOnUiThread {
            Toast.makeText(activity, title, Toast.LENGTH_SHORT).show()
            promise.resolve(Arguments.makeNativeMap(mapOf("errMsg" to "showToast:ok")))
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    fun getDeviceInfo(): Map<String, Any?> {
        return mapOf(
            "platform" to "Android",
            "systemVersion" to Build.VERSION.RELEASE,
            "model" to Build.MODEL,
        )
    }

    internal fun handleBridgeMessage(message: NebulaBridgeMessage) {
        if (listenerCount <= 0 || message.sourceEmitterId == emitterId) {
            return
        }
        when (message.direction) {
            "toHost" -> {
                if (currentRuntimeAppId != null) {
                    return
                }
                emitEvent(
                    HOST_MESSAGE_EVENT,
                    mapOf(
                        "appId" to message.appId,
                        "message" to message.message,
                        "timestamp" to message.timestamp,
                    ),
                )
            }

            "toMiniApp" -> {
                if (currentRuntimeAppId != message.appId) {
                    return
                }
                emitEvent(
                    MINI_APP_MESSAGE_EVENT,
                    mapOf(
                        "appId" to message.appId,
                        "message" to message.message,
                        "timestamp" to message.timestamp,
                    ),
                )
            }
        }
    }

    internal fun handlePageLifecycle(event: NebulaPageLifecycleEvent) {
        if (listenerCount <= 0) {
            return
        }
        if (currentRuntimeAppId != null && currentRuntimeAppId != event.appId) {
            return
        }
        emitEvent(
            PAGE_LIFECYCLE_EVENT,
            mapOf(
                "appId" to event.appId,
                "instanceId" to event.instanceId,
                "routePath" to event.routePath,
                "type" to event.type,
            ),
        )
    }

    private fun emitEvent(eventName: String, payload: Map<String, Any?>) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, Arguments.makeNativeMap(payload))
    }

    private fun resolveNavigation(
        method: String,
        promise: Promise,
        action: () -> Result<Unit>,
    ) {
        val activity = reactApplicationContext.getCurrentActivity() ?: NebulaHost.currentActivity()
        if (activity == null) {
            promise.reject("no_activity", "$method:fail no activity")
            return
        }
        activity.runOnUiThread {
            action().onSuccess {
                promise.resolve(Arguments.makeNativeMap(mapOf("errMsg" to "$method:ok")))
            }.onFailure { error ->
                promise.reject(method, "$method:fail ${error.message ?: "unknown"}")
            }
        }
    }
}
