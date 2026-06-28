package com.hectorzhuang.nebula

import java.lang.ref.WeakReference
import java.util.UUID
import java.util.concurrent.CopyOnWriteArrayList

data class NebulaBridgeMessage(
  val direction: String,
  val appId: String,
  val message: Map<String, Any?>,
  val sourceEmitterId: String,
  val timestamp: Double,
)

data class NebulaPageLifecycleEvent(
  val appId: String,
  val instanceId: String,
  val routePath: String,
  val type: String,
)

object NebulaEventHub {
  private val moduleRefs = CopyOnWriteArrayList<WeakReference<NebulaNativeModule>>()

  fun nextEmitterId(): String = UUID.randomUUID().toString()

  fun register(module: NebulaNativeModule) {
    cleanup()
    moduleRefs.add(WeakReference(module))
  }

  fun unregister(module: NebulaNativeModule) {
    moduleRefs.removeAll { it.get() == null || it.get() === module }
  }

  fun publishBridgeMessage(message: NebulaBridgeMessage) {
    cleanup()
    moduleRefs.forEach { it.get()?.handleBridgeMessage(message) }
  }

  fun publishPageLifecycle(event: NebulaPageLifecycleEvent) {
    cleanup()
    moduleRefs.forEach { it.get()?.handlePageLifecycle(event) }
  }

  private fun cleanup() {
    moduleRefs.removeAll { it.get() == null }
  }
}
