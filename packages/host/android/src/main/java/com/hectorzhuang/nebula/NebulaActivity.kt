package com.hectorzhuang.nebula

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.view.ViewTreeObserver
import android.widget.FrameLayout
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.Toolbar
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.updatePadding
import com.facebook.react.interfaces.fabric.ReactSurface
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler
import java.util.UUID

class NebulaActivity : AppCompatActivity(), DefaultHardwareBackBtnHandler {
  companion object {
    private const val EXTRA_APP_ID = "nebula.app_id"
    private const val EXTRA_ROUTE_PATH = "nebula.route_path"
    private const val EXTRA_ROUTE_URL = "nebula.route_url"
    private const val EXTRA_INITIAL_PROPS = "nebula.initial_props"
    private const val EXTRA_INSTANCE_ID = "nebula.instance_id"

    fun createIntent(
      activity: Activity,
      appId: String,
      routePath: String,
      routeUrl: String,
      initialProps: Map<String, Any?>,
    ): Intent {
      return Intent(activity, NebulaActivity::class.java).apply {
        putExtra(EXTRA_APP_ID, appId)
        putExtra(EXTRA_ROUTE_PATH, routePath)
        putExtra(EXTRA_ROUTE_URL, routeUrl)
        putExtra(EXTRA_INITIAL_PROPS, org.json.JSONObject(initialProps).toString())
        putExtra(EXTRA_INSTANCE_ID, UUID.randomUUID().toString())
      }
    }
  }

  lateinit var appId: String
    private set

  private lateinit var instanceId: String
  private lateinit var routePath: String
  private lateinit var routeUrl: String
  private lateinit var rootHost: FrameLayout
  private lateinit var toolbar: Toolbar
  private var reactSurface: ReactSurface? = null
  private var currentPageStyle: Map<String, Any?> = emptyMap()
  private var didSignalContentReady = false
  private var reactContentCreated = false

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    appId = intent.getStringExtra(EXTRA_APP_ID) ?: error("Missing appId")
    routePath = NebulaManifestManager.normalizeRoute(intent.getStringExtra(EXTRA_ROUTE_PATH))
    routeUrl = intent.getStringExtra(EXTRA_ROUTE_URL) ?: "nebula://$appId$routePath"
    instanceId = intent.getStringExtra(EXTRA_INSTANCE_ID) ?: UUID.randomUUID().toString()

    NebulaManifestManager.loadManifest(appId, NebulaConfig.sandboxDir(appId))

    // Toolbar sits at the top; its top padding will be adjusted for the status bar inset.
    toolbar = Toolbar(this).apply {
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        LinearLayout.LayoutParams.WRAP_CONTENT,
      )
    }

    // rootHost fills the remaining space below the toolbar.
    rootHost = FrameLayout(this).apply {
      id = View.generateViewId()
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        0,
        1f,
      )
    }

    // A vertical LinearLayout guarantees rootHost is always below the toolbar
    // without any manual margin/padding calculation.
    val contentLayout = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        LinearLayout.LayoutParams.MATCH_PARENT,
      )
      addView(toolbar)
      addView(rootHost)
    }

    setSupportActionBar(toolbar)
    supportActionBar?.setDisplayHomeAsUpEnabled(false)
    toolbar.setNavigationOnClickListener { onBackPressedDispatcher.onBackPressed() }

    setContentView(contentLayout)

    // Apply status-bar inset as top padding on the toolbar so its background
    // extends behind the status bar (edge-to-edge).
    ViewCompat.setOnApplyWindowInsetsListener(toolbar) { v, insets ->
      val statusBarHeight = insets.getInsets(WindowInsetsCompat.Type.statusBars()).top
      v.updatePadding(top = statusBarHeight)
      insets
    }

    NebulaRouter.register(this)
    updatePageStyle(NebulaManifestManager.getPageConfig(appId, routePath))
  }

  override fun onResume() {
    super.onResume()
    NebulaAppManager.onHostResume(appId, this, this)
    if (!reactContentCreated) {
      reactContentCreated = true
      createReactContent()
    }
    NebulaEventHub.publishPageLifecycle(
      NebulaPageLifecycleEvent(appId, instanceId, routePath, "show"),
    )
  }

  override fun onPause() {
    NebulaEventHub.publishPageLifecycle(
      NebulaPageLifecycleEvent(appId, instanceId, routePath, "hide"),
    )
    NebulaAppManager.onHostPause(appId, this)
    super.onPause()
  }

  override fun onDestroy() {
    NebulaEventHub.publishPageLifecycle(
      NebulaPageLifecycleEvent(appId, instanceId, routePath, "unload"),
    )
    reactSurface?.stop()
    reactSurface?.clear()
    reactSurface = null
    NebulaAppManager.onHostDestroy(appId, this)
    NebulaRouter.unregister(this)
    super.onDestroy()
  }

  override fun invokeDefaultOnBackPressed() {
    super.onBackPressed()
  }

  fun updatePageStyle(style: Map<String, Any?>) {
    currentPageStyle = style
    val backgroundColor =
      parseColor(style["backgroundColor"] as? String)
        ?: parseColor(style["navigationBarBackgroundColor"] as? String)
        ?: Color.WHITE
    rootHost.setBackgroundColor(backgroundColor)

    val title = style["navigationBarTitleText"] as? String
    supportActionBar?.title = title ?: appId

    val navBackground = parseColor(style["navigationBarBackgroundColor"] as? String) ?: backgroundColor
    supportActionBar?.setBackgroundDrawable(android.graphics.drawable.ColorDrawable(navBackground))

    val textColor = parseColor(style["navigationBarTextColor"] as? String) ?: Color.BLACK
    toolbar.setTitleTextColor(textColor)
    toolbar.navigationIcon?.setTint(textColor)

    val navigationStyle = (style["navigationStyle"] as? String)?.lowercase() ?: "default"
    if (navigationStyle == "custom") {
      supportActionBar?.hide()
    } else {
      supportActionBar?.show()
      val shouldShowBackButton = !isEntryRoute()
      supportActionBar?.setDisplayHomeAsUpEnabled(shouldShowBackButton)
      supportActionBar?.setHomeButtonEnabled(shouldShowBackButton)
    }
  }

  override fun onSupportNavigateUp(): Boolean {
    onBackPressedDispatcher.onBackPressed()
    return true
  }

  private fun isEntryRoute(): Boolean {
    val entryRoute = NebulaManifestManager.normalizeRoute(
      NebulaManifestManager.getEntryPagePath(appId),
    )
    return routePath == entryRoute
  }

  private fun createReactContent() {
    val moduleName =
      NebulaManifestManager.getComponentName(appId, routePath)
        ?: NebulaManifestManager.getComponentName(appId, "/")
        ?: "NebulaApp"
    val initialProps = createInitialProps()
    reactSurface = NebulaAppManager.createSurface(appId, this, moduleName, initialProps)
    reactSurface?.start()
    rootHost.removeAllViews()
    reactSurface?.view?.let { view ->
      rootHost.addView(
        view,
        FrameLayout.LayoutParams(
          FrameLayout.LayoutParams.MATCH_PARENT,
          FrameLayout.LayoutParams.MATCH_PARENT,
        ),
      )
      registerFirstContentDrawListener(view)
    }
  }

  private fun registerFirstContentDrawListener(view: View) {
    val observer = view.viewTreeObserver
    if (!observer.isAlive) {
      handleMiniappContentReady()
      return
    }

    observer.addOnPreDrawListener(
      object : ViewTreeObserver.OnPreDrawListener {
        override fun onPreDraw(): Boolean {
          if (view.viewTreeObserver.isAlive) {
            view.viewTreeObserver.removeOnPreDrawListener(this)
          }
          handleMiniappContentReady()
          return true
        }
      },
    )
  }

  private fun handleMiniappContentReady() {
    if (didSignalContentReady) {
      return
    }
    didSignalContentReady = true
    NebulaEventHub.publishPageLifecycle(
      NebulaPageLifecycleEvent(appId, instanceId, routePath, "ready"),
    )
    NebulaRouter.onMiniappContentReady(appId)
  }

  private fun createInitialProps(): Bundle {
    val props = parseJsonMap(intent.getStringExtra(EXTRA_INITIAL_PROPS))
    val pageStyle = NebulaManifestManager.getPageConfig(appId, routePath)
    props["appId"] = appId
    props["instanceId"] = instanceId
    props["sandboxPath"] = NebulaConfig.sandboxDir(appId).absolutePath
    props["__routePath"] = routePath
    props["__routeUrl"] = routeUrl
    props["__pageConfig"] = pageStyle
    return props.toBundle()
  }

  private fun parseColor(color: String?): Int? {
    if (color.isNullOrBlank()) {
      return null
    }
    return runCatching { Color.parseColor(color) }.getOrNull()
  }

  private fun parseJsonMap(raw: String?): MutableMap<String, Any?> {
    if (raw.isNullOrBlank()) {
      return linkedMapOf()
    }
    return NebulaManifestManager.jsonObjectToMap(org.json.JSONObject(raw)).toMutableMap()
  }
}

private fun Map<String, Any?>.toBundle(): Bundle {
  val bundle = Bundle()
  forEach { (key, value) ->
    when (value) {
      null -> bundle.putString(key, null)
      is String -> bundle.putString(key, value)
      is Int -> bundle.putInt(key, value)
      is Double -> bundle.putDouble(key, value)
      is Boolean -> bundle.putBoolean(key, value)
      is Float -> bundle.putFloat(key, value)
      is Long -> bundle.putLong(key, value)
      is Map<*, *> -> {
        @Suppress("UNCHECKED_CAST")
        bundle.putBundle(key, (value as Map<String, Any?>).toBundle())
      }
      else -> bundle.putString(key, value.toString())
    }
  }
  return bundle
}