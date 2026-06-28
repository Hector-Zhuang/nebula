package com.hectorzhuang.nebula

import java.io.File
import org.json.JSONObject

data class NebulaInstalledApp(
  val appId: String,
  val mode: String,
  val bundlePath: String,
  val sourceUrl: String,
  val version: String? = null,
  val updateStrategy: String = "manual",
)

data class NebulaManifest(
  val appId: String,
  val entryPagePath: String?,
  val pages: Map<String, String>,
  val pageConfigs: Map<String, Map<String, Any?>>,
  val updateStrategy: String?,
  val version: String?,
  val window: Map<String, Any?>,
)

object NebulaManifestManager {
  private val manifests = linkedMapOf<String, NebulaManifest>()

  @Synchronized
  fun registerManifest(appId: String, manifest: NebulaManifest) {
    manifests[appId] = manifest
  }

  @Synchronized
  fun registerRoutes(appId: String, routes: Map<String, String>) {
    val current = manifests[appId]
    manifests[appId] =
      NebulaManifest(
        appId = appId,
        entryPagePath = current?.entryPagePath ?: "/",
        pages = routes,
        pageConfigs = current?.pageConfigs ?: emptyMap(),
        updateStrategy = current?.updateStrategy,
        version = current?.version,
        window = current?.window ?: emptyMap(),
      )
  }

  fun loadManifest(appId: String, sandboxDir: File): NebulaManifest? {
    val manifestFile = File(sandboxDir, "app.json")
    if (!manifestFile.exists()) {
      return manifests[appId]
    }
    val manifest = parseManifest(appId, JSONObject(manifestFile.readText()))
    manifests[appId] = manifest
    return manifest
  }

  fun removeManifest(appId: String) {
    manifests.remove(appId)
  }

  fun getManifest(appId: String): NebulaManifest? = manifests[appId]

  fun getEntryPagePath(appId: String): String = manifests[appId]?.entryPagePath ?: "/"

  fun getComponentName(appId: String, routePath: String): String? {
    val manifest = manifests[appId] ?: return null
    return manifest.pages[normalizeRoute(routePath)]
  }

  fun getPageConfig(appId: String, routePath: String): Map<String, Any?> {
    val manifest = manifests[appId] ?: return emptyMap()
    val normalizedRoute = normalizeRoute(routePath)
    val base = manifest.window.toMutableMap()
    manifest.pageConfigs[normalizedRoute]?.let { base.putAll(it) }
    if (normalizedRoute != "/" && base["navigationBarTitleText"] == null) {
      manifest.pageConfigs["/"]?.get("navigationBarTitleText")?.let {
        base["navigationBarTitleText"] = it
      }
    }
    return base
  }

  private fun parseManifest(appId: String, json: JSONObject): NebulaManifest {
    val pagesObject = json.optJSONObject("pages") ?: JSONObject()
    val pageConfigsObject = json.optJSONObject("pageConfigs") ?: JSONObject()
    val pages = mutableMapOf<String, String>()
    val pageConfigs = mutableMapOf<String, Map<String, Any?>>()

    pagesObject.keys().forEach { key ->
      pages[normalizeRoute(key)] = pagesObject.optString(key)
    }

    pageConfigsObject.keys().forEach { key ->
      pageConfigs[normalizeRoute(key)] = jsonObjectToMap(pageConfigsObject.optJSONObject(key))
    }

    return NebulaManifest(
      appId = json.optString("appId", appId),
      entryPagePath = normalizeRoute(json.optString("entryPagePath", "/")),
      pages = pages,
      pageConfigs = pageConfigs,
      updateStrategy = json.optString("updateStrategy", "manual"),
      version = json.optString("version", null),
      window = jsonObjectToMap(json.optJSONObject("window")),
    )
  }

  internal fun normalizeRoute(routePath: String?): String {
    val raw = routePath?.takeIf { it.isNotBlank() } ?: "/"
    return if (raw.startsWith("/")) raw else "/$raw"
  }

  internal fun jsonObjectToMap(jsonObject: JSONObject?): Map<String, Any?> {
    if (jsonObject == null) {
      return emptyMap()
    }
    val result = linkedMapOf<String, Any?>()
    jsonObject.keys().forEach { key ->
      val value = jsonObject.opt(key)
      result[key] =
        when (value) {
          is JSONObject -> jsonObjectToMap(value)
          JSONObject.NULL -> null
          else -> value
        }
    }
    return result
  }
}
