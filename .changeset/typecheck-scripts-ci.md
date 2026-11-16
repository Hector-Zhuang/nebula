---
'@nebula-rn/components': minor
'@nebula-rn/host-apis': minor
'@nebula-rn/sdk': minor
'@nebula-rn/client': minor
---

Add a `typecheck` (`tsc --noEmit`) script to the components, host-apis, sdk, and client packages, plus a root `typecheck` script that fans out via Nx and a dedicated Typecheck step in CI.
