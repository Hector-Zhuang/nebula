package com.devrunner

import android.app.Application
import com.hectorzhuang.nebula.NebulaHost
import com.hectorzhuang.nebula.NebulaHostDelegate
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactPackage
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost

class MainApplication : Application(), ReactApplication {

  override val reactHost: ReactHost by lazy {
    getDefaultReactHost(
      context = applicationContext,
      packageList = PackageList(this).packages,
    )
  }

  override fun onCreate() {
    super.onCreate()
    loadReactNative(this)
    NebulaHost.initialize(
      this,
      object : NebulaHostDelegate {
        override fun isDebugBuild(): Boolean = BuildConfig.DEBUG

        override fun createMiniAppPackages(application: Application): List<ReactPackage> =
          PackageList(this@MainApplication).packages
      },
    )
  }
}
