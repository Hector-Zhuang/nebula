# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Nebula, **please do not open a public GitHub issue**.

Instead, report it privately through GitHub's [private vulnerability reporting](https://github.com/Hector-Zhuang/nebula/security/advisories/new) ("Report a vulnerability" on the [Security tab](https://github.com/Hector-Zhuang/nebula/security)).

Please include:

- A description of the vulnerability and its impact
- Steps to reproduce (proof of concept preferred)
- Affected package(s) and version(s)
- Any suggested remediation, if available

## Response Timeline

| Stage | Target |
| --- | --- |
| Initial acknowledgment | Within 72 hours |
| Triage and severity assessment | Within 7 days |
| Fix or mitigation plan | Shared after triage |
| Disclosure | Coordinated after a fix is released |

## Scope

In scope:

- Packages under [`packages/`](./packages) (host runtime, SDK, CLI, host APIs, Nebula Cloud and console)
- Examples under [`examples/`](./examples)

Out of scope:

- Vulnerabilities in third-party dependencies (report them upstream; feel free to notify us so we can update the dependency)
- Attacks requiring physical access to a device or a compromised developer machine
- Missing best-practice hardening without a concrete, demonstrable exploit

## Security Updates

Security fixes are published as patch releases and noted in release notes and GitHub Security Advisories.
