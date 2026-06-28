<p align="center">
  <h1 align="center">Nebula</h1>
  <p align="center">An enterprise-grade SuperApp framework powered by React Native</p>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/github/license/Hector-ZHuang/nebula?style=flat-square" alt="License"></a>
  <a href="#"><img src="https://img.shields.io/github/stars/Hector-Zhuang/nebula?style=flat-square" alt="Stars"></a>
  <a href="#"><img src="https://img.shields.io/github/actions/workflow/status/user/nebula/ci.yml?style=flat-square" alt="CI"></a>
</p>

---

## What is Nebula?

Nebula is an enterprise-grade **SuperApp framework** built on top of React Native. It enables organizations to deliver a unified native host application while empowering multiple teams to develop, ship, and iterate on independent **MiniApps** in a true micro-frontend fashion.

Designed for scale, Nebula separates the host runtime from business MiniApps through a clean SDK boundary, giving large engineering organizations the agility to deploy features independently without rebuilding or redeploying the entire application.

## Key Features

- **🏗️ Host + MiniApp Architecture** — Decouple the native host from business modules for independent development and release cycles.
- **🛠️ CLI with Project Scaffolding** — Rapidly bootstrap hosts, MiniApps, and shared libraries through the `nebula` CLI.
- **📦 Cross-platform UI Component Library** — Ship consistent user experiences across iOS and Android with `@nebula-rn/components`.
- **☁️ Cloud Platform & Management Console** — Manage MiniApp lifecycle, releases, and analytics via Nebula Cloud and the admin console.
- **🔌 Extensible Host API System** — Expose native capabilities to MiniApps through a well-defined, pluggable host API layer.
- **🚀 Hot Reload Development Experience** — Develop MiniApps with fast refresh and a universal dev runner for rapid iteration.

## Architecture

Nebula is organized in three conceptual layers:

```text
┌─────────────────────────────────────────┐
│            MiniApps Layer               │
│  (business modules: payment, tickets,   │
│   shopping, ride-hailing, etc.)         │
├─────────────────────────────────────────┤
│            Nebula SDK Layer             │
│  (runtime, navigation, bridge, APIs)    │
├─────────────────────────────────────────┤
│            Host Layer                   │
│  (React Native host app + native APIs)  │
└─────────────────────────────────────────┘
```

The **Host** provides the native container and shared services. The **SDK** exposes a stable API surface and runtime for MiniApps. **MiniApps** are self-contained business modules that communicate with the host exclusively through the SDK, ensuring isolation and independent upgrade paths.

## Quick Start

Get started with Nebula in five simple steps:

### 1. Install the CLI

```sh
npm install -g nebula
# or
yarn global add nebula
```

### 2. Create a new project

```sh
nebula new my-superapp
```

### 3. Install dependencies

```sh
cd my-superapp
npm install
```

### 4. Start the development server

```sh
npm run dev
```

### 5. Build for production

```sh
npm run build
```

For platform-specific run instructions, explore the [`examples/`](examples/) directory.

## Packages

| Package | Path | Description |
|---------|------|-------------|
| `@nebula-rn/client` | `packages/nebula-sdk` | Nebula miniapp client API surface |
| `nebula` (CLI) | `packages/cli` | Nebula CLI |
| `@nebula-rn/components` | `packages/components` | Nebula UI Components for React Native |
| `@nebula-rn/dev-runner` | `packages/dev-runner` | Nebula universal development runner |
| `@nebula-rn/host` | `packages/host` | Nebula native-first host integration package |
| `@nebula-rn/host-apis` | `packages/host-apis` | Official Nebula host API feature bundle |
| `@nebula-rn/cloud` | `packages/nebula-cloud` | Nebula Cloud backend service |
| `@nebula-rn/nebula-console` | `packages/nebula-console` | Nebula management console |
| `@nebula-rn/docs` | `packages/nebula-docs` | Nebula documentation site |
| `@nebula-rn/sdk` | `packages/nebula-sdk` | Nebula Mini-App Framework SDK |
| `@nebula-rn/template` | `packages/template` | Starter templates for Nebula CLI |

## Examples

The [`examples/`](examples/) directory contains sample SuperApp projects that demonstrate how to integrate the host application with multiple MiniApps. These examples are the best way to learn Nebula patterns and conventions.

## Documentation

Full documentation is available at [https://nebula-docs.example.com](https://nebula-docs.example.com).

- [Getting Started](https://nebula-docs.example.com/getting-started)
- [Host Development](https://nebula-docs.example.com/host)
- [MiniApp Development](https://nebula-docs.example.com/miniapp)
- [API Reference](https://nebula-docs.example.com/api)

## Contributing

We welcome contributions from the community. Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to submit issues, propose features, and open pull requests.

## License

Nebula is licensed under the [Apache License 2.0](LICENSE).
