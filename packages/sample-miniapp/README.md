# Sample MiniApp

A reference miniapp that exercises the Nebula client APIs and the `@nebula-rn/components` component library. It doubles as a manual test harness: every base-library API and cross-platform component has a dedicated demo page.

## Run

```sh
npm install
npm run dev      # launch Metro + Dev Runner with hot reload
```

For production-style validation:

```sh
npm run build    # produce the bundle
npm run upload   # upload to the configured Nebula Cloud
```

## What's inside

The page registry lives in [app.json](./app.json). Pages are grouped as follows:

| Group | Pages | Demonstrates |
| --- | --- | --- |
| Hubs | `home`, `api-tests`, `nebula` | Entry points linking to the API and component demos |
| Base-library APIs | `api-tests-device`, `api-tests-storage-file`, `api-tests-media`, `api-tests-events` | Device info, storage and filesystem, media, network/sensor events from `@nebula-rn/client` |
| Scan | `scan-code` | `scanCode` and `scanCodeSafe` result handling |
| Components | `components/media`, `components/swiper`, `components/picker`, `components/richtext`, `components/map`, `components/webview`, `components/icon` | Components from `@nebula-rn/components` (the icon page is a reserved placeholder) |
| Lifecycle | `lifecycle` | `usePageOnLoad` / `usePageOnShow` and related hooks |
| Navigation | `page1`, `page2`, `page3` | Pushing and returning through the native page stack |

Some component pages (map, video, camera, webview) require the host to have integrated the corresponding native modules; they are designed to fail gracefully and surface the capability error when the host does not provide them.

## Related

- [Miniapp APIs](../nebula-docs/content/docs/miniapp-apis)
- [@nebula-rn/components reference](../nebula-docs/content/docs/reference/nebula-components.mdx)
- [Page lifecycle](../nebula-docs/content/docs/miniapp/page-lifecycle.mdx)
