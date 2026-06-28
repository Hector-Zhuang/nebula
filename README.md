<p align="center">
  <h1 align="center">Nebula</h1>
  <p align="center">An enterprise-grade SuperApp framework powered by React Native</p>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@nebula-rn/cli"><img src="https://img.shields.io/npm/v/@nebula-rn/cli?style=flat-square&logo=npm" alt="npm version"></a>
  <a href="https://github.com/Hector-Zhuang/nebula/blob/main/LICENSE"><img src="https://img.shields.io/github/license/Hector-Zhuang/nebula?style=flat-square" alt="License"></a>
  <a href="https://github.com/Hector-Zhuang/nebula/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/Hector-Zhuang/nebula/ci.yml?style=flat-square&logo=githubactions" alt="CI"></a>
  <a href="https://github.com/Hector-Zhuang/nebula"><img src="https://img.shields.io/github/stars/Hector-Zhuang/nebula?style=flat-square&logo=github" alt="Stars"></a>
  <a href="https://discord.gg/XAWb7CXHA2"><img src="https://img.shields.io/discord/1435718435505176606?style=flat-square&logo=discord&logoColor=white&label=Discord" alt="Discord"></a>
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

## Quick Start

Get started with Nebula in five simple steps:

> The CLI is published as **`@nebula-rn/cli`**. The bare `nebula` name on npm belongs to an unrelated package, so always use the scoped name (the binary itself is still `nebula`).

### 1. Create a host project

```sh
npx @nebula-rn/cli create host my-host
```

### 2. Create a MiniApp

```sh
npx @nebula-rn/cli create miniapp my-miniapp
cd my-miniapp
npm install
```

### 3. Start the dev runner

```sh
npx @nebula-rn/cli miniapp dev
```

The `dev` command launches a universal Dev Runner automatically. To scaffold your own Dev Runner project — for example to simulate custom host APIs for miniapp developers — use the `runner` template:

```sh
npx @nebula-rn/cli create runner my-runner
cd my-runner
npm install
```

### 4. Build the MiniApp bundle

```sh
npx @nebula-rn/cli miniapp build
```

### 5. Upload to Nebula Cloud (optional)

```sh
npx @nebula-rn/cli auth login
npx @nebula-rn/cli miniapp upload
```

You can also install the CLI globally:

```sh
npm install -g @nebula-rn/cli
```

For platform-specific run instructions, explore the [`examples/`](examples/) directory.

## Packages

| Package | Path | Description |
|---------|------|-------------|
| `@nebula-rn/client` | `packages/api` | Nebula miniapp client API surface |
| `@nebula-rn/cli` | `packages/cli` | Nebula CLI |
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

Full documentation is available at **[nebula.hector.im](https://nebula.hector.im)**:

- [Getting Started](https://nebula.hector.im/docs/getting-started/overview)
- [Host Development](https://nebula.hector.im/docs/host/configuration)
- [MiniApp Development](https://nebula.hector.im/docs/miniapp/development)
- [MiniApp APIs](https://nebula.hector.im/docs/miniapp-apis/storage)
- [API Reference](https://nebula.hector.im/docs/reference/nebula-sdk)
- [All documentation](https://nebula.hector.im/docs)

## Contributing

We welcome contributions from the community. Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to submit issues, propose features, and open pull requests.

## License

Nebula is licensed under the [Apache License 2.0](LICENSE).
