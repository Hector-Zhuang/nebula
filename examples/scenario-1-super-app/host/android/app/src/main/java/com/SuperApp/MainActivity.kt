package com.hectorzhuang.nebula.scenario.superapp.host

import android.content.Intent
import android.os.Bundle
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.hectorzhuang.nebula.NebulaHost

class MainActivity : ReactActivity() {

  override fun getMainComponentName(): String = "ScenarioSuperappHost"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    NebulaHost.handleIncomingUrl(this, intent?.data)
  }

  override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
    NebulaHost.handleIncomingUrl(this, intent.data)
  }
}
