# @nebula-rn/cli

The command-line tool for [Nebula](https://github.com/Hector-Zhuang/nebula), an
enterprise-grade SuperApp framework for React Native. Scaffold host apps and
MiniApps, develop them against a universal Dev Runner, build production
bundles, and upload versions to Nebula Cloud.

> The bare npm name `nebula` belongs to an unrelated package. Always install
> and invoke the CLI via the `@nebula-rn/cli` package; the installed binary is
> named `nebula`.

## Quick start

```bash
# Scaffold a MiniApp
npx @nebula-rn/cli create miniapp my-miniapp
cd my-miniapp
npm install

# Develop with the universal Dev Runner
npx @nebula-rn/cli miniapp dev

# Build production bundles (iOS + Android) under build/
npx @nebula-rn/cli miniapp build
```

You can also install it globally:

```bash
npm install -g @nebula-rn/cli
nebula create host my-host
```

## Commands

| Command | Description |
|---|---|
| `nebula create host <name>` | Scaffold a native host project |
| `nebula create miniapp <name>` | Scaffold a pure-JS MiniApp project |
| `nebula create runner <name>` | Scaffold a development runner |
| `nebula miniapp dev` | Start Metro and launch the Dev Runner |
| `nebula miniapp build` | Build iOS and Android production bundles |
| `nebula miniapp upload` | Build and upload a version to Nebula Cloud |
| `nebula auth login` / `logout` | Authenticate against Nebula Cloud |
| `nebula config server` | Configure the Nebula Cloud API URL |

Scaffolding flags: `--app-id`, `--display-name`, `--bundle-id`, `--directory`.
Dev flags: `--platform ios|android`, `--no-runner`.

## Requirements

- Node.js >= 20
- A React Native development environment (Xcode / Android Studio) for running
  the Dev Runner

## Documentation

- Getting started and guides:
  https://github.com/Hector-Zhuang/nebula/tree/main/packages/nebula-docs/content/docs
- CLI reference:
  https://github.com/Hector-Zhuang/nebula/blob/main/packages/nebula-docs/content/docs/reference/cli.mdx

## License

Apache-2.0
