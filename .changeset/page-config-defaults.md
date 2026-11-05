---
'@nebula-rn/sdk': minor
---

Add `resolvePageConfig` for page config default handling and export the `ResolvedMiniAppPageConfig` type. `createMiniAppPage` now resolves `__pageConfig` with `navigationStyle`/`visualEffectInBackground` defaults and a typed page style instead of an untyped pass-through.
