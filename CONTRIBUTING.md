# Contributing to Nebula

Thank you for your interest in contributing to Nebula! This guide will help you get started.

## Development Environment Setup

### Prerequisites
- Node.js >= 18
- npm >= 9
- Git

### Getting Started
1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/nebula.git`
3. Install dependencies: `npm install`
4. Build all packages: `npx nx run-many --target=build`

## Development Workflow

### Branch Strategy
- `main` - stable release branch
- `develop` - development integration branch
- `feature/*` - feature branches
- `fix/*` - bug fix branches

### Commit Convention
We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - new feature
- `fix:` - bug fix
- `docs:` - documentation changes
- `style:` - code style changes (formatting, etc.)
- `refactor:` - code refactoring
- `test:` - adding or updating tests
- `chore:` - build process or auxiliary tool changes

Example: `feat(cli): add template generation command`

### Pull Request Process
1. Create a feature/fix branch from `develop`
2. Make your changes with appropriate tests
3. Ensure all checks pass: `npx nx run-many --target=lint && npx nx run-many --target=test`
4. Submit a PR to `develop` with a clear description
5. Wait for review and address feedback

## Reporting Issues
- Use GitHub Issues with the provided templates
- Include reproduction steps for bugs
- Check existing issues before creating a new one

## Releasing

Nebula uses [Changesets](https://github.com/changesets/changesets) for version management and publishing.

### Adding a Changeset

After making user-facing changes, run:

```bash
npm run changeset
```

The CLI will prompt you to:
1. Select the affected packages
2. Choose a bump level: `patch`, `minor`, or `major`
3. Write a short description of the change

This generates a `.changeset/*.md` file. Commit this file with your PR.

### How Releases Work

1. When a PR with changesets is merged to `main`, the Release workflow opens a **"Version Packages"** PR.
2. Review the version bumps and changelogs in that PR.
3. Merging the "Version Packages" PR triggers the workflow to publish to npm.

### Published Packages

| Package | Description |
|---|---|
| `@nebula-rn/sdk` | JavaScript/TypeScript client SDK |
| `@nebula-rn/host` | Native-first host integration package |
| `@nebula-rn/host-apis` | Host API feature bundle |
| `@nebula-rn/components` | UI Components for React Native |
| `@nebula-rn/client` | Miniapp client API surface |
| `@nebula-rn/cli` | CLI for building and uploading mini-apps |

## Code of Conduct
Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) before contributing.

## License
By contributing, you agree that your contributions will be licensed under the Apache License 2.0.
