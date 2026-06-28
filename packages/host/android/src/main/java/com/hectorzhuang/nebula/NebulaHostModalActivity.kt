package com.hectorzhuang.nebula

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.view.View
import android.widget.FrameLayout
import androidx.appcompat.app.AppCompatActivity
import com.facebook.react.ReactHost
import com.facebook.react.interfaces.fabric.ReactSurface
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler
import com.facebook.react.modules.core.PermissionAwareActivity
import com.facebook.react.modules.core.PermissionListener
import org.json.JSONObject

class NebulaHostModalActivity :
  AppCompatActivity(),
  DefaultHardwareBackBtnHandler,
  PermissionAwareActivity {
  companion object {
    private const val EXTRA_MODULE_NAME = "nebula.modal.module_name"
    private const val EXTRA_INITIAL_PROPS = "nebula.modal.initial_props"

    fun createIntent(
      context: Context,
      moduleName: String,
      initialProps: Map<String, Any?>,
    ): Intent {
      return Intent(context, NebulaHostModalActivity::class.java).apply {
        putExtra(EXTRA_MODULE_NAME, moduleName)
        putExtra(EXTRA_INITIAL_PROPS, JSONObject(initialProps).toString())
      }
    }
  }

  private lateinit var rootHost: FrameLayout
  private var reactSurface: ReactSurface? = null
  private var permissionListener: PermissionListener? = null

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)

    val moduleName = intent.getStringExtra(EXTRA_MODULE_NAME) ?: error("Missing moduleName")
    val initialProps = parseJsonMap(intent.getStringExtra(EXTRA_INITIAL_PROPS)).toBundle()

    rootHost = FrameLayout(this).apply {
      id = View.generateViewId()
      layoutParams =
        FrameLayout.LayoutParams(
          FrameLayout.LayoutParams.MATCH_PARENT,
          FrameLayout.LayoutParams.MATCH_PARENT,
        )
      setBackgroundColor(android.graphics.Color.TRANSPARENT)
    }

    setContentView(rootHost)

    reactSurface = resolveReactHost().createSurface(this, moduleName, initialProps)
    reactSurface?.start()
    reactSurface?.view?.let { view ->
      rootHost.addView(
        view,
        FrameLayout.LayoutParams(
          FrameLayout.LayoutParams.MATCH_PARENT,
          FrameLayout.LayoutParams.MATCH_PARENT,
        ),
      )
    }

    NebulaHost.setPresentedHostModalActivity(this)
  }

  override fun onResume() {
    super.onResume()
    resolveReactHost().onHostResume(this, this)
  }

  override fun onPause() {
    resolveReactHost().onHostPause(this)
    super.onPause()
  }

  override fun onDestroy() {
    reactSurface?.stop()
    reactSurface?.clear()
    reactSurface = null
    resolveReactHost().onHostDestroy(this)
    if (NebulaHost.presentedHostModalActivity() === this) {
      NebulaHost.setPresentedHostModalActivity(null)
    }
    super.onDestroy()
  }

  override fun invokeDefaultOnBackPressed() {
    super.onBackPressed()
  }

  override fun checkPermission(permission: String, pid: Int, uid: Int): Int {
    return super.checkPermission(permission, pid, uid)
  }

  override fun checkSelfPermission(permission: String): Int {
    return if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
      super.checkSelfPermission(permission)
    } else {
      PackageManager.PERMISSION_GRANTED
    }
  }

  override fun shouldShowRequestPermissionRationale(permission: String): Boolean {
    return if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
      super.shouldShowRequestPermissionRationale(permission)
    } else {
      false
    }
  }

  override fun requestPermissions(
    permissions: Array<String>,
    requestCode: Int,
    listener: PermissionListener?,
  ) {
    permissionListener = listener
    if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.M) {
      super.requestPermissions(permissions, requestCode)
    }
  }

  override fun onRequestPermissionsResult(
    requestCode: Int,
    permissions: Array<String>,
    grantResults: IntArray,
  ) {
    super.onRequestPermissionsResult(requestCode, permissions, grantResults)
    val shouldClear =
      permissionListener?.onRequestPermissionsResult(
        requestCode,
        permissions,
        grantResults,
      ) ?: false
    if (shouldClear) {
      permissionListener = null
    }
  }

  private fun resolveReactHost(): ReactHost {
    return NebulaHost.resolveHostReactHost(application)
  }

  private fun parseJsonMap(raw: String?): Map<String, Any?> {
    if (raw.isNullOrBlank()) {
      return emptyMap()
    }
    return NebulaManifestManager.jsonObjectToMap(JSONObject(raw))
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
