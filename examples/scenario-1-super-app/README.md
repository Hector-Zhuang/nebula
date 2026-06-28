# Scenario 1: SuperApp

A SuperApp host with four independent MiniApps. It demonstrates how separate business teams can ship distinct miniapps while sharing one native host and its registered Host APIs.

## Layout

```text
host/                 React Native host application
miniapps/
  ride-hailing/       Ride booking        (appId: superapp-ride-hailing)
  shopping/           Shopping mall       (appId: superapp-shopping)
  tickets/            Movie/event tickets (appId: superapp-travel)
  payment-code/       Payment QR code     (appId: superapp-payments)
```

The host registers the official Host APIs (`@nebula-rn/host-apis`) and opens each miniapp through `NebulaAPI` on the native navigation stack.

## Requirements

- Node.js 20 or newer
- React Native development environment (Xcode and/or Android Studio)
- A running [Nebula Cloud](../../packages/nebula-cloud) instance for bundle distribution

## Run

### 1. Start the host

```sh
cd host
npm install
cd ios && pod install && cd ..   # iOS only
npm run ios                      # or: npm run android
```

### 2. Point the host at your Nebula Cloud

The host downloads miniapp bundles from a Nebula Cloud instance. Edit `HOST_SERVER_BASE_URL` in [host/App.tsx](./host/App.tsx) before running:

- Simulator: `http://localhost:3001/api`
- Physical device: your computer's LAN IP, e.g. `http://192.168.x.x:3001/api` (the committed value is a placeholder that must be replaced)

### 3. Develop a miniapp

Each miniapp is a standalone project:

```sh
cd miniapps/shopping
npm install
npm run dev      # start Metro + Dev Runner with hot reload
npm run build    # produce an uploadable bundle
```

Builds are uploaded to Nebula Cloud (via `nebula miniapp upload`) and released to the experience or production channel in the management console.

## Related

- [Nebula business scenarios](../../packages/nebula-docs/content/docs/scenarios.mdx)
- [Miniapp development](../../packages/nebula-docs/content/docs/miniapp/development.mdx)
