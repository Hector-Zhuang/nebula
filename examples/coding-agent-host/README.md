# Coding Agent Host

A chat-based host in which an AI agent creates, modifies, builds, and deploys Nebula miniapps from natural language. The generated miniapp is previewed live on device and published through Nebula Cloud via OTA.

## Layout

```text
src/        React Native chat UI (conversation, settings, tooling status)
server/     Node/Express agent service: LLM orchestration, miniapp builder,
            deployer, and an MCP server exposing create/build/deploy tools
```

The server exposes an [MCP](https://modelcontextprotocol.io/) endpoint so any compatible AI client can drive the same create → build → deploy pipeline.

## Requirements

- Node.js 20 or newer
- React Native development environment (Xcode and/or Android Studio)
- An OpenAI-compatible LLM endpoint (default: a local [Ollama](https://ollama.com/) instance)
- A running [Nebula Cloud](../../packages/nebula-cloud) instance

## Run

### 1. Start the agent server

```sh
cd server
npm install
npm run dev
```

Configuration (environment variables):

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3100` | Agent server port |
| `PROJECTS_DIR` | `server/projects` | Directory for generated miniapp projects |
| `CLOUD_BASE_URL` | `http://localhost:3001/api` | Nebula Cloud API URL |

### 2. Configure the LLM

The app ships with Ollama defaults (`http://localhost:11434/v1`, model `qwen2.5-coder:7b`) in [src/config/constants.ts](./src/config/constants.ts). On a physical device, or when using another provider, open the in-app **Settings** screen and set the base URL, API key, and model.

### 3. Start the host app

```sh
npm install
cd ios && pod install && cd ..   # iOS only
npm run ios                      # or: npm run android
```

Describe an app in the chat, for example *"build an inventory page with a counter and a save button"*. The agent generates the code, builds it, deploys it to Nebula Cloud, and the host loads the new miniapp over the air.

## Troubleshooting

- The app and server run on separate processes: the app reaches the server at `http://localhost:3100` by default. On a physical device replace `localhost` with your computer's LAN IP in the app settings.
- Generated projects are kept under `server/projects/`; deleting a project there removes it from subsequent builds.
