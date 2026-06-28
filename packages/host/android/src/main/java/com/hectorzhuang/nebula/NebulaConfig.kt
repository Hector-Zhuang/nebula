package com.hectorzhuang.nebula

import android.app.Application
import java.io.File
import java.io.FileOutputStream
import java.net.URI
import java.net.URL
import java.net.URLConnection
import java.util.zip.ZipInputStream
import java.util.concurrent.ConcurrentHashMap

object NebulaConfig {
    private const val PREFS_NAME = "nebula.config"
    private const val SERVER_BASE_URL_KEY = "_serverBaseURL"
    private val installedApps = ConcurrentHashMap<String, NebulaInstalledApp>()
    private lateinit var application: Application

    var serverBaseURL: String?
        get() = application.getSharedPreferences(PREFS_NAME, 0).getString(SERVER_BASE_URL_KEY, null)
        set(value) {
            val prefs = application.getSharedPreferences(PREFS_NAME, 0)
            val normalized = normalizeServerBaseURL(value)
            if (normalized == null) {
                prefs.edit().remove(SERVER_BASE_URL_KEY).apply()
            } else {
                prefs.edit().putString(SERVER_BASE_URL_KEY, normalized).apply()
            }
        }

    fun initialize(app: Application) {
        application = app
        restoreInstalledApps()
    }

    fun sandboxDir(appId: String): File {
        val dir = File(application.filesDir, "nebula/$appId")
        if (!dir.exists()) {
            dir.mkdirs()
        }
        return dir
    }

    fun bundleFile(appId: String): File = File(sandboxDir(appId), "index.android.bundle")

    fun installApp(
        appId: String,
        bundleURL: String,
        connectToURLMetroServer: Boolean = false,
    ): NebulaInstalledApp {
        val sandboxDir = sandboxDir(appId)
        val bundleFile = bundleFile(appId)
        downloadToFile(bundleURL, bundleFile)
        var manifest: NebulaManifest? = null
        deriveManifestUrl(bundleURL)?.let { manifestURL ->
            runCatching {
                downloadToFile(manifestURL, File(sandboxDir, "app.json"))
                manifest = NebulaManifestManager.loadManifest(appId, sandboxDir)
            }
        }

        val installed =
            NebulaInstalledApp(
                appId = appId,
                mode = if (connectToURLMetroServer) "development" else "production",
                bundlePath = bundleFile.absolutePath,
                sourceUrl = bundleURL,
                version = if (connectToURLMetroServer) null else manifest?.version,
                updateStrategy =
                    if (connectToURLMetroServer) {
                        "manual"
                    } else {
                        manifest?.updateStrategy ?: "manual"
                    },
            )
        installedApps[appId] = installed
        persistInstalledApp(installed)
        return installed
    }

    fun installApp(
        appId: String,
        bundleURL: String,
        manifestURL: String,
        assetsURL: String,
        connectToURLMetroServer: Boolean = false,
    ): NebulaInstalledApp {
        val sandboxDir = sandboxDir(appId)
        val bundleFile = bundleFile(appId)
        downloadToFile(bundleURL, bundleFile)
        downloadToFile(manifestURL, File(sandboxDir, "app.json"))
        if (!connectToURLMetroServer) {
            downloadAndExtractAssets(assetsURL, sandboxDir)
        }
        val manifest = NebulaManifestManager.loadManifest(appId, sandboxDir)
        val installed =
            NebulaInstalledApp(
                appId = appId,
                mode = if (connectToURLMetroServer) "development" else "production",
                bundlePath = bundleFile.absolutePath,
                sourceUrl = bundleURL,
                version = if (connectToURLMetroServer) null else manifest?.version,
                updateStrategy =
                    if (connectToURLMetroServer) {
                        "manual"
                    } else {
                        manifest?.updateStrategy ?: "manual"
                    },
            )
        installedApps[appId] = installed
        persistInstalledApp(installed)
        return installed
    }

    fun getInstalledApp(appId: String): NebulaInstalledApp? = installedApps[appId]

    fun isDevelopmentMode(installedApp: NebulaInstalledApp): Boolean {
        return installedApp.mode.equals("development", ignoreCase = true)
    }

    fun getDevServerHost(installedApp: NebulaInstalledApp): String? {
        if (!isDevelopmentMode(installedApp)) {
            return null
        }

        val uri = runCatching { URI(installedApp.sourceUrl) }.getOrNull() ?: return null
        val host = uri.host ?: return null
        val port = uri.port
        return if (port > 0) "$host:$port" else host
    }

    fun getDevModulePath(installedApp: NebulaInstalledApp): String? {
        if (!isDevelopmentMode(installedApp)) {
            return null
        }

        val uri = runCatching { URI(installedApp.sourceUrl) }.getOrNull() ?: return null
        val path = uri.path?.trim().orEmpty()
        if (path.isEmpty()) {
            return null
        }

        val trimmedPath = path.trimStart('/')
        return if (trimmedPath.endsWith(".bundle")) {
            trimmedPath.removeSuffix(".bundle")
        } else {
            trimmedPath
        }
    }

    fun installedAppIds(): List<String> = installedApps.keys.sorted()

    fun clearApp(appId: String) {
        installedApps.remove(appId)
        application.getSharedPreferences(PREFS_NAME, 0).edit().remove(appId).apply()
        NebulaManifestManager.removeManifest(appId)
        sandboxDir(appId).deleteRecursively()
    }

    private fun persistInstalledApp(installedApp: NebulaInstalledApp) {
        val json =
            """
      {"appId":"${installedApp.appId}","mode":"${installedApp.mode}","bundlePath":"${installedApp.bundlePath}","sourceUrl":"${installedApp.sourceUrl}","version":${installedApp.version?.let { "\"$it\"" } ?: "null"},"updateStrategy":"${installedApp.updateStrategy}"}
      """.trimIndent()
        application.getSharedPreferences(PREFS_NAME, 0).edit().putString(installedApp.appId, json)
            .apply()
    }

    private fun restoreInstalledApps() {
        val prefs = application.getSharedPreferences(PREFS_NAME, 0).all
        prefs.forEach { (key, value) ->
            if (key == SERVER_BASE_URL_KEY) {
                return@forEach
            }
            val raw = value as? String ?: return@forEach
            runCatching {
                val json = org.json.JSONObject(raw)
                installedApps[key] =
                    NebulaInstalledApp(
                        appId = json.optString("appId", key),
                        mode = json.optString("mode", "production"),
                        bundlePath = json.optString("bundlePath"),
                        sourceUrl = json.optString("sourceUrl"),
                        version = json.optString("version", null),
                        updateStrategy = json.optString("updateStrategy", "manual"),
                    )
                NebulaManifestManager.loadManifest(key, sandboxDir(key))
            }
        }
    }

    private fun deriveManifestUrl(bundleURL: String): String? {
        return runCatching {
            val uri = URI(bundleURL)
            val path = uri.path ?: return null
            val parentPath = path.substringBeforeLast('/', "")
            if (parentPath.isEmpty()) {
                return null
            }
            URI(
                uri.scheme,
                uri.authority,
                "$parentPath/app.json",
                null,
                null,
            ).toString()
        }.getOrNull()
    }

    fun resolveRemoteUrl(rawURL: String): String {
        val trimmedURL = rawURL.trim()
        if (trimmedURL.isEmpty() || trimmedURL.startsWith("file://")) {
            return rawURL
        }

        val base = serverBaseURL ?: return trimmedURL
        val baseUri = runCatching { URI(base) }.getOrNull() ?: return trimmedURL

        if (trimmedURL.startsWith("/")) {
            return URI(baseUri.scheme, baseUri.authority, trimmedURL, null, null).toString()
        }

        val remoteUri = runCatching { URI(trimmedURL) }.getOrNull()
        if (remoteUri?.scheme?.lowercase() in listOf("http", "https")) {
            if (shouldReplaceRemoteHost(remoteUri?.host)) {
                return URI(
                    baseUri.scheme,
                    baseUri.authority,
                    remoteUri?.path,
                    remoteUri?.query,
                    remoteUri?.fragment,
                ).toString()
            }
            return trimmedURL
        }

        val normalizedBasePath = baseUri.path?.trim('/').orEmpty()
        val normalizedRelativePath = trimmedURL.trim('/')
        val mergedPath =
            listOf(normalizedBasePath, normalizedRelativePath).filter { it.isNotEmpty() }
                .joinToString("/")
        return URI(baseUri.scheme, baseUri.authority, "/$mergedPath", null, null).toString()
    }

    private fun downloadToFile(source: String, destination: File) {
        destination.parentFile?.mkdirs()
        val connection = openConnection(source)
        connection.getInputStream().use { input ->
            FileOutputStream(destination).use { output ->
                input.copyTo(output)
            }
        }
    }

    private fun openConnection(source: String): URLConnection {
        return if (source.startsWith("file://")) {
            URI(source).toURL().openConnection()
        } else if (source.startsWith("/")) {
            File(source).toURI().toURL().openConnection()
        } else {
            URL(source).openConnection().apply {
                connectTimeout = 15000
                readTimeout = 15000
            }
        }
    }

    fun normalizeServerBaseURL(rawURL: String?): String? {
        val trimmedURL = rawURL?.trim().orEmpty()
        if (trimmedURL.isEmpty()) {
            return null
        }

        val uri = runCatching { URI(trimmedURL) }.getOrNull() ?: return null
        val scheme = uri.scheme?.lowercase() ?: return null
        if (scheme != "http" && scheme != "https") {
            return null
        }
        val host = uri.host ?: return null
        val normalizedPath = uri.path?.trimEnd('/').orEmpty()
        return URI(
            scheme,
            uri.userInfo,
            host,
            uri.port,
            normalizedPath,
            null,
            null,
        ).toString()
    }

    private fun shouldReplaceRemoteHost(host: String?): Boolean {
        val normalizedHost = host?.lowercase() ?: return false
        return normalizedHost == "localhost" || normalizedHost == "127.0.0.1" || normalizedHost == "0.0.0.0"
    }

    private fun downloadAndExtractAssets(assetsURL: String, sandboxDir: File) {
        val zipFile = File(sandboxDir, "assets.zip")
        try {
            downloadToFile(assetsURL, zipFile)
            extractZipFile(zipFile, sandboxDir)
        } finally {
            zipFile.delete()
        }
    }

    private fun extractZipFile(zipFile: File, destinationDir: File) {
        ZipInputStream(zipFile.inputStream().buffered()).use { zipStream ->
            var entry = zipStream.nextEntry
            while (entry != null) {
                val entryFile = File(destinationDir, entry.name)
                if (entry.isDirectory) {
                    entryFile.mkdirs()
                } else {
                    entryFile.parentFile?.mkdirs()
                    FileOutputStream(entryFile).use { output ->
                        zipStream.copyTo(output)
                    }
                }
                zipStream.closeEntry()
                entry = zipStream.nextEntry
            }
        }
    }
}
