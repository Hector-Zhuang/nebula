package com.hectorzhuang.nebula

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.FrameLayout
import com.facebook.react.interfaces.fabric.ReactSurface
import java.lang.ref.WeakReference
import java.util.concurrent.CopyOnWriteArrayList

object NebulaRouter {
    private const val MINIAPP_LOADING_MODULE = "NebulaInternalMiniappLoading"
    const val LOADING_EXIT_ANIMATION_MS = 240L

    @Volatile
    private var intentionalLoadingDelayMs = 0L
    @Volatile
    private var enterContentDelayMs = 0L
    @Volatile
    private var loadingEnabled = false

    fun setMiniappLoadingDelay(delayMs: Long) {
        intentionalLoadingDelayMs = delayMs.coerceAtLeast(0L)
    }

    fun setMiniappLoadingEnterContentDelay(delayMs: Long) {
        enterContentDelayMs = delayMs.coerceAtLeast(0L)
    }

    fun setMiniappLoadingEnabled(enabled: Boolean) {
        loadingEnabled = enabled
    }

    private val activityRefs = CopyOnWriteArrayList<WeakReference<NebulaActivity>>()

    // Tracks loading overlays attached to caller activities, keyed by appId.
    // The overlay lives in the caller's window while NebulaActivity is starting.
    private data class PendingOverlay(
        val callerActivity: WeakReference<Activity>,
        val overlayHost: FrameLayout,
        val reactSurface: ReactSurface,
    )

    private val pendingOverlays = CopyOnWriteArrayList<Pair<String, PendingOverlay>>()

    fun register(activity: NebulaActivity) {
        cleanup()
        activityRefs.add(WeakReference(activity))
    }

    fun unregister(activity: NebulaActivity) {
        activityRefs.removeAll { it.get() == null || it.get() === activity }
    }

    fun openApp(
        activity: Activity,
        appId: String,
        routePath: String,
        initialProps: Map<String, Any?>
    ) {
        val installedApp = NebulaConfig.getInstalledApp(appId)
        val isProduction = installedApp?.mode?.equals("production", ignoreCase = true) == true
        val enterDelay = enterContentDelayMs

        val launchActivity = {
            activity.startActivity(
                NebulaActivity.createIntent(
                    activity = activity,
                    appId = appId,
                    routePath = routePath,
                    routeUrl = buildRouteUrl(appId, routePath),
                    initialProps = initialProps,
                ),
            )
        }

        if (loadingEnabled && isProduction && enterDelay > 0L) {
            // 1. Attach loading overlay to caller's window decor view BEFORE starting NebulaActivity.
            val overlay = attachLoadingOverlayToCallerWindow(activity, appId, installedApp!!)
            if (overlay != null) {
                // 2. Wait enterContentDelayMs, then launch NebulaActivity.
                activity.window.decorView.postDelayed({
                    NebulaAppManager.startHost(appId) {
                        launchActivity()
                    }
                }, enterDelay)
                return
            }
        }

        // Pre-warm the ReactHostImpl so the ReactInstance is ready before NebulaActivity is created.
        // onReactContextInitialized is always called on the UI thread.
        NebulaAppManager.startHost(appId) {
            launchActivity()
        }
    }

    /**
     * Called by NebulaActivity once its first frame is drawn and ready.
     * Dismisses the loading overlay that was attached to the caller's window.
     */
    fun onMiniappContentReady(appId: String) {
        val iterator = pendingOverlays.iterator()
        while (iterator.hasNext()) {
            val (id, overlay) = iterator.next()
            if (id == appId) {
                pendingOverlays.remove(id to overlay)
                dismissOverlay(overlay)
                break
            }
        }
    }

    private fun attachLoadingOverlayToCallerWindow(
        callerActivity: Activity,
        appId: String,
        installedApp: NebulaInstalledApp,
    ): PendingOverlay? {
        val decorView = callerActivity.window.decorView as? FrameLayout ?: return null
        val hostReactHost =
            runCatching { NebulaHost.resolveHostReactHost(callerActivity.application) }
                .getOrNull() ?: return null

        val overlayHost = FrameLayout(callerActivity).apply {
            layoutParams = FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT,
                FrameLayout.LayoutParams.MATCH_PARENT,
            )
            isClickable = true
            isFocusable = true
        }

        val surface = hostReactHost.createSurface(
            callerActivity,
            MINIAPP_LOADING_MODULE,
            Bundle().apply {
                putString("appId", appId)
                putString("mode", installedApp.mode)
            },
        )
        surface.start()
        surface.view?.let { view ->
            overlayHost.addView(
                view,
                FrameLayout.LayoutParams(
                    FrameLayout.LayoutParams.MATCH_PARENT,
                    FrameLayout.LayoutParams.MATCH_PARENT,
                ),
            )
        }

        decorView.addView(overlayHost)
        decorView.bringChildToFront(overlayHost)

        val pending = PendingOverlay(
            callerActivity = WeakReference(callerActivity),
            overlayHost = overlayHost,
            reactSurface = surface,
        )
        pendingOverlays.add(appId to pending)
        return pending
    }

    private fun dismissOverlay(overlay: PendingOverlay) {
        val totalDelay = intentionalLoadingDelayMs + LOADING_EXIT_ANIMATION_MS
        val caller = overlay.callerActivity.get() ?: run {
            overlay.reactSurface.stop()
            overlay.reactSurface.clear()
            return
        }
        caller.runOnUiThread {
            caller.window.decorView.postDelayed({
                overlay.reactSurface.stop()
                overlay.reactSurface.clear()
                (overlay.overlayHost.parent as? FrameLayout)?.removeView(overlay.overlayHost)
            }, totalDelay)
        }
    }

    fun navigateToURL(url: String, fromAppId: String): Result<Unit> {
        val source = currentActivity(fromAppId)
            ?: return Result.failure(IllegalStateException("No active page"))
        val parsed = parseUrl(url, fromAppId)
        NebulaManifestManager.getComponentName(parsed.appId, parsed.routePath)
            ?: return Result.failure(IllegalArgumentException(
                "No component registered for route '${parsed.routePath}' in app '${parsed.appId}'"
            ))
        source.startActivity(
            NebulaActivity.createIntent(
                activity = source,
                appId = parsed.appId,
                routePath = parsed.routePath,
                routeUrl = parsed.routeUrl,
                initialProps = parsed.params,
            ),
        )
        return Result.success(Unit)
    }

    fun redirectToURL(url: String, fromAppId: String): Result<Unit> {
        val source = currentActivity(fromAppId)
            ?: return Result.failure(IllegalStateException("No active page"))
        val parsed = parseUrl(url, fromAppId)
        NebulaManifestManager.getComponentName(parsed.appId, parsed.routePath)
            ?: return Result.failure(IllegalArgumentException(
                "No component registered for route '${parsed.routePath}' in app '${parsed.appId}'"
            ))
        source.startActivity(
            NebulaActivity.createIntent(
                activity = source,
                appId = parsed.appId,
                routePath = parsed.routePath,
                routeUrl = parsed.routeUrl,
                initialProps = parsed.params,
            ),
        )
        source.finish()
        return Result.success(Unit)
    }

    fun reLaunchURL(url: String, fromAppId: String): Result<Unit> {
        val source = currentActivity(fromAppId)
            ?: return Result.failure(IllegalStateException("No active page"))
        val parsed = parseUrl(url, fromAppId)
        NebulaManifestManager.getComponentName(parsed.appId, parsed.routePath)
            ?: return Result.failure(IllegalArgumentException(
                "No component registered for route '${parsed.routePath}' in app '${parsed.appId}'"
            ))
        val intent =
            NebulaActivity.createIntent(
                activity = source,
                appId = parsed.appId,
                routePath = parsed.routePath,
                routeUrl = parsed.routeUrl,
                initialProps = parsed.params,
            ).apply {
                addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP)
            }
        source.startActivity(intent)
        activitiesForApp(parsed.appId).forEach { existing ->
            if (existing !== source) {
                existing.finish()
            }
        }
        source.finish()
        return Result.success(Unit)
    }

    fun navigateBack(fromAppId: String, delta: Int): Result<Unit> {
        val activities = activitiesForApp(fromAppId)
        if (activities.isEmpty()) {
            return Result.failure(IllegalStateException("No active page"))
        }
        activities.takeLast(delta.coerceAtLeast(1)).forEach { it.finish() }
        return Result.success(Unit)
    }

    fun closeApp(appId: String): Result<Unit> {
        val target =
            currentActivity(appId) ?: return Result.failure(IllegalStateException("No active page"))
        target.finish()
        return Result.success(Unit)
    }

    fun updatePageStyle(appId: String, style: Map<String, Any?>): Result<Unit> {
        val target =
            currentActivity(appId) ?: return Result.failure(IllegalStateException("No active page"))
        target.updatePageStyle(style)
        return Result.success(Unit)
    }

    private fun currentActivity(appId: String): NebulaActivity? =
        activitiesForApp(appId).lastOrNull()

    private fun activitiesForApp(appId: String): List<NebulaActivity> {
        cleanup()
        return activityRefs.mapNotNull { it.get() }.filter { it.appId == appId && !it.isFinishing }
    }

    private fun cleanup() {
        activityRefs.removeAll { it.get() == null }
    }

    private fun buildRouteUrl(appId: String, routePath: String): String {
        val normalizedRoute = NebulaManifestManager.normalizeRoute(routePath)
        return "nebula://$appId${if (normalizedRoute == "/") "" else normalizedRoute}"
    }

    private fun parseUrl(url: String, fallbackAppId: String): ParsedNebulaUrl {
        val uri = android.net.Uri.parse(url)
        val appId = uri.host?.takeIf { it.isNotBlank() } ?: fallbackAppId
        val routePath = NebulaManifestManager.normalizeRoute(uri.path)
        val params = linkedMapOf<String, Any?>()
        uri.queryParameterNames.forEach { key ->
            params[key] = uri.getQueryParameter(key)
        }
        return ParsedNebulaUrl(appId, routePath, url, params)
    }
}

private data class ParsedNebulaUrl(
    val appId: String,
    val routePath: String,
    val routeUrl: String,
    val params: Map<String, Any?>,
)
