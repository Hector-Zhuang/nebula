# Sample Mini App

This mini app is loaded by the host `SuperApp` through Nebula.

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
