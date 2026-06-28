# Contributing to Nebula

Thank you for your interest in contributing to Nebula! This guide will help you
get a local development environment running and explain our branch, commit, and
pull request conventions.

## Development Environment Setup

### Prerequisites

- Node.js >= 20 (the monorepo declares `"engines": { "node": ">=20" }`)
- npm >= 10 (npm workspaces are used for package management)
- Git
- For running iOS hosts/examples on macOS: Xcode (latest stable) and CocoaPods
- For running Android hosts/examples: Android Studio, JDK 17, Android SDK and an
  emulator or device

### Getting started

1. Fork the repository.
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/nebula.git
   cd nebula
   ```
3. Install all workspace dependencies:
   ```bash
   npm install
   ```
4. Build the publishable packages (TypeScript compilation):
   ```bash
   npx nx run-many --target=build
   ```

### Common development commands

| Command | What it does |
|---|---|
| `npm run lint` | Run ESLint across the repository |
| `npm run lint:fix` | Auto-fix lint issues |
| `npm test` | Run the Jest test suite |
| `npx nx run-many --target=build` | Build every package that declares a `build` target |
| `npm run docs:dev` | Start the documentation site locally |
| `npm run cloud:dev` | Start Nebula Cloud locally (requires PostgreSQL) |
| `npm run runner:ios` / `npm run runner:android` | Build and run the Dev Runner |
| `npm run start` / `npm run ios` / `npm run android` | Run the sample host |

For MiniApp development inside a workspace project, run
`npx @nebula-rn/cli miniapp dev` from the MiniApp directory — the CLI starts
Metro and launches the Dev Runner.

For native host work, run `pod install` in the iOS directory the first time,
and make sure the Android SDK / emulator are configured.

## Development Workflow

### Branch strategy

- `main` — the stable branch; all pull requests target `main`
- `feature/<short-name>` — new features
- `fix/<short-name>` — bug fixes
- `docs/<short-name>` — documentation-only changes

Create your branch from an up-to-date `main`:

```bash
git checkout main && git pull origin main
git checkout -b feature/short-description
```

### Commit convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` — a new feature
- `fix:` — a bug fix
- `docs:` — documentation-only changes
- `style:` — formatting changes with no code impact
- `refactor:` — code refactoring with no behavior change
- `test:` — adding or updating tests
- `chore:` — build, tooling, or maintenance changes
- `perf:` — a performance improvement

Use a scope when it clarifies the area, for example:

```text
feat(cli): support external template paths
fix(host-apis): guard empty scan result
docs(sdk): clarify page lifecycle ordering
```

Keep commits focused and write commit messages that explain **what** and
**why**, not just the diff.

### Pull request process

1. Make sure your branch is up to date with `main`.
2. Keep changes focused; one logical change per PR.
3. Add or update tests for code changes, and update documentation when public
   APIs, CLI commands, or behavior change.
4. Run the local checks before requesting review:
   ```bash
   npm run lint
   npm test
   npx nx run-many --target=build
   ```
5. If your change affects a published package, add a changeset (see below).
6. Open the PR against `main` and fill in the pull request template completely.
7. Address review feedback by pushing new commits (avoid force-pushing reviewed
   PRs unless asked).

A maintainer will review your PR. The `#q-and-a` channel in our Discord and
GitHub Discussions are good places to ask questions before starting large
changes; for non-trivial features, consider opening an issue first so the
approach can be aligned.

### Good first issues

Issues labeled `good first issue` are scoped for new contributors. Each should
include implementation hints; if anything is unclear, ask in the issue before
starting.

## Reporting issues

- Use GitHub Issues and choose the appropriate template (Bug Report, Feature
  Request, or Question).
- Search existing issues (including closed ones) before filing.
- Bug reports must include reproduction steps, expected/actual behavior, and
  environment (OS, Node.js, Nebula version, React Native version).
- Do **not** report security vulnerabilities in public issues — follow
  [SECURITY.md](./SECURITY.md).

## Releasing

Nebula uses [Changesets](https://github.com/changesets/changesets) for version
management and npm publishing.

### Adding a changeset

After making a user-facing change to a published package, run:

```bash
npm run changeset
```

Select the affected packages, choose the bump level (`patch`, `minor`, or
`major`), and write a short user-facing description. Commit the generated
`.changeset/*.md` file with your PR.

During the 0.x phase, APIs may still change; use `minor` for new functionality
and `patch` for fixes, and call out any breaking change explicitly in the
changeset description.

### How releases work

1. When PRs containing changesets merge to `main`, the Release workflow opens a
   **"chore(release): version packages"** pull request.
2. Maintainers review the version bumps and generated changelogs.
3. Merging that PR triggers the Release workflow to publish the updated
   packages to npm.

### Published packages

The following packages are public and published to npm under the `@nebula-rn`
scope:

| Package | Description |
|---|---|
| `@nebula-rn/sdk` | Core runtime, lifecycle, navigation, and Host API protocol |
| `@nebula-rn/client` | Stable client API surface for MiniApp developers |
| `@nebula-rn/host` | Native-first host integration package (iOS/Android) |
| `@nebula-rn/host-apis` | Official Host API implementations and helpers |
| `@nebula-rn/components` | Cross-platform React Native UI components |
| `@nebula-rn/cli` | CLI for scaffolding, developing, building, and uploading MiniApps |

The bare npm name `nebula` belongs to an unrelated package — always use the
scoped names. Dev Runner, Nebula Cloud, the console, documentation site,
templates, and sample apps are private workspace packages.

## Code of Conduct

Please read and follow our [Code of Conduct](./CODE_OF_CONDUCT.md). We enforce a
respectful, harassment-free community across GitHub, Discord, and all project
spaces.

## License

By contributing, you agree that your contributions will be licensed under the
[Apache License 2.0](./LICENSE).
