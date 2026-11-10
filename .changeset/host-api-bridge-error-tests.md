---
'@nebula-rn/sdk': minor
---

Add protocol error handling tests for the host API bridge server: non-protocol and unknown-kind requests are ignored, non-`Error` throws and failing `supported()` probes map to `INTERNAL_ERROR`, missing payloads reach handlers as `{}`, and failed capability resolution logs without replying.
