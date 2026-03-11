# Sample Mini App

This mini app is loaded by the host `SuperApp` through Nebula.

## Architecture

This sample mini-app demonstrates a multi-page architecture where **each page is registered separately** as an independent React Native component:

- `NebulaApp_Home` - Home page (default)
- `NebulaApp_Page1` - First test page
- `NebulaApp_Page2` - Second test page  
- `NebulaApp_Page3` - Third test page (includes stack limit testing)

The native router automatically instantiates the correct page component based on the route path:
- `nebula://sample-miniapp/` → NebulaApp_Home
- `nebula://sample-miniapp/page1` → NebulaApp_Page1
- `nebula://sample-miniapp/page2` → NebulaApp_Page2
- `nebula://sample-miniapp/page3` → NebulaApp_Page3

This approach is similar to WeChat mini-programs, where each page is independently registered and managed by the native container.

## Start dev server (hot update)

Run from workspace root:

```bash
npm run sample:start
```

Metro will run on `http://127.0.0.1:8082`.

Host app downloads this dev bundle URL:

`http://127.0.0.1:8082/index.bundle?platform=ios&dev=true&minify=false&entryFile=miniapps/sample/index.js`

When you edit files under `miniapps/sample`, Metro rebuilds automatically.
Re-open the mini app from host to fetch the latest bundle.

## Build production bundle

```bash
npm run sample:bundle:ios
```

Output: `miniapps/sample/build/main.jsbundle`
