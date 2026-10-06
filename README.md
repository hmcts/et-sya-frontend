# et-sya-frontend

Employment Tribunals Self-Assign (claimant) frontend service — a Node.js/Express web application that enables citizens and representatives to submit and manage Employment Tribunal claims.

Part of the HMCTS Reform programme, integrating with `et-cos` (Java backend), IDAM (OAuth2 / OpenID Connect), Redis (sessions / pre-login cache), and CCD (case management).

---

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Quick Start](#quick-start)
  - [Running the Application](#running-the-application)
  - [Running with Docker](#running-with-docker)
  - [Running with CFTLIB](#running-with-cftlib)
  - [Environment Variables & Secrets](#environment-variables--secrets)
- [Developing](#developing)
  - [Code Style & Linting](#code-style--linting)
  - [Building Assets](#building-assets)
- [Testing](#testing)
  - [Unit & Route Tests](#unit--route-tests)
  - [Contract (Pact) Tests](#contract-pact-tests)
  - [Accessibility (a11y) Tests](#accessibility-a11y-tests)
  - [Functional & E2E Tests (Playwright)](#functional--e2e-tests-playwright)
  - [CI Checks](#ci-checks)
- [Security](#security)
  - [CSRF Prevention](#csrf-prevention)
  - [Helmet & Security Headers](#helmet--security-headers)
  - [Google Tag Manager & Cookie Manager](#google-tag-manager--cookie-manager)
  - [Vulnerability Management](#vulnerability-management)
- [Healthcheck](#healthcheck)
- [Team & License](#team--license)

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 20.8.0`
- [Yarn](https://yarnpkg.com/) v4 (`4.12.0`)
- [Docker](https://www.docker.com/) & Docker Compose (optional, for containerised run)
- [Redis](https://redis.io/) (optional, for Redis session/cache in dev)

### Quick Start

```bash
# Install dependencies (also sets up Husky and compiles assets)
yarn install

# Start development server with file-store sessions (no Redis required)
yarn start:dev
```

The application will be available at `https://localhost:3002`.

### Running the Application

| Command              | Description                                                                                     |
| -------------------- | ----------------------------------------------------------------------------------------------- |
| `yarn start:dev`     | Runs with `nodemon` using file-store sessions (recommended for local development without Redis) |
| `yarn start:dev-red` | Starts local `redis-server` and runs with `nodemon` using Redis sessions                        |
| `yarn start:debug`   | Starts local `redis-server` and runs `src/main/server.ts` with Node inspect on port `9229`      |
| `yarn start`         | Production mode (`NODE_ENV=production`)                                                         |

### Running with Docker

Build and run using Docker Compose:

```bash
# Build Docker image
docker-compose build

# Start container
docker-compose up
```

The container exposes port `3002`. Access the application at `https://localhost:3002`.

### Running with CFTLIB

When running against CFTLIB / local IDAM, configure the IDAM endpoints in your environment or override config:

```bash
IDAM_WEB_URL=http://localhost:<PORT>/login
IDAM_API_URL=http://localhost:<PORT>/o/token
```

Replace `<PORT>` with the port exposed by CFTLIB for IDAM (typically `5062`).

### Environment Variables & Secrets

The application consumes configuration and secrets via [node-config](https://github.com/node-config/node-config).

In deployed Kubernetes environments (AAT, Perftest, Prod), secrets are mounted from Azure Key Vault into container volumes and loaded via `@hmcts/properties-volume`. In local development, you can provide them as environment variables or override them in `config/local.json` (gitignored).

Key secrets and configurations include:

| Configuration Path             | Environment Variable                    | Key Vault Secret Name            | Description                                                                                                           |
| ------------------------------ | --------------------------------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `services.launchDarkly.key`    | `LAUNCH_DARKLY_SDK_KEY`                 | `launch-darkly-sdk-key`          | LaunchDarkly server SDK key for feature toggling (e.g. `welsh-language`, `bundles`, `ecc`, `MUL2`, `eraOctober2026`). |
| `services.addressLookup.token` | `ADDRESS_LOOKUP_TOKEN`                  | `os-places-token`                | Ordnance Survey Places API token used for postcode and address lookup.                                                |
| `services.addressLookup.url`   | `ADDRESS_LOOK_UP_URL`                   | —                                | Address lookup API base URL (defaults to `https://api.os.uk/search/places/v1/postcode`).                              |
| `services.idam.clientSecret`   | `IDAM_CLIENT_SECRET`                    | `idam-secret`                    | IDAM OAuth2 client secret for token authentication callbacks.                                                         |
| `services.idam.clientID`       | —                                       | —                                | IDAM OAuth2 client ID (defaults to `et-sya`).                                                                         |
| `services.s2s.secret`          | `S2S_SECRET`                            | `s2s-secret-sya`                 | Service-to-service authentication secret for inter-service communication with `et-sya-api`.                           |
| `services.s2s.url`             | `S2S_URL`                               | —                                | Service-to-service auth provider endpoint.                                                                            |
| `csrf.secret`                  | `CSRF_SECRET`                           | `csrf-token-secret`              | Double-CSRF token secret used by `csrf-csrf`.                                                                         |
| `session.secret`               | `SESSION_SECRET`                        | `et-session-secret`              | Express session signing secret.                                                                                       |
| `session.redis.key`            | `REDIS_KEY`                             | `et-managed-redis-access-key`    | Azure Managed Redis access key for session storage and pre-login cache.                                               |
| `services.pcq.token`           | `PCQ_TOKEN`                             | `pcq-token-key`                  | Token key for Protected Characteristics Questionnaire (PCQ) service.                                                  |
| `appInsights.connectionString` | `APPLICATIONINSIGHTS_CONNECTION_STRING` | `app-insights-connection-string` | Azure Application Insights telemetry connection string.                                                               |

#### Local Development Secrets Example

To run features locally that require external services (such as address lookup or LaunchDarkly), you can set environment variables in your terminal:

```bash
export LAUNCH_DARKLY_SDK_KEY="<your-launchdarkly-key>"
export ADDRESS_LOOKUP_TOKEN="<your-os-places-token>"
```

Or create a local configuration override file `config/local.json`:

```json
{
  "services": {
    "launchDarkly": {
      "key": "<your-launchdarkly-key>"
    },
    "addressLookup": {
      "token": "<your-os-places-token>"
    }
  }
}
```

---

## Developing

### Code Style & Linting

The project uses [ESLint](https://github.com/typescript-eslint/typescript-eslint), [Prettier](https://github.com/prettier/prettier), [Stylelint](https://stylelint.io/), and [sass-lint](https://github.com/sasstools/sass-lint). [Husky](https://github.com/typicode/husky) and `lint-staged` run pre-commit checks automatically.

```bash
# Run all linters (sass-lint, ESLint with --fix, and Prettier check)
yarn lint

# Auto-fix linting and formatting issues
yarn lint --fix
```

### Building Assets

Assets (SCSS, JS, static files) are compiled using Webpack:

```bash
# Development build
yarn build

# Production build
yarn build:prod

# Compile TypeScript to JS in ./src/main
yarn build:ts
```

---

## Testing

### Unit & Route Tests

Unit and route tests are executed via [Jest](https://jestjs.io/) and compiled fast using `@swc/jest`:

```bash
# Run unit tests
yarn test:unit

# Run a single test file or pattern
yarn test:unit -- --testPathPattern="TypeOfClaimController"

# Run route integration tests
yarn test:routes

# Run unit tests with code coverage
yarn test:coverage

# Validate translation keys (English vs Welsh)
yarn test:translations

# Run mutation testing (Stryker)
yarn test:mutation
```

### Contract (Pact) Tests

Pact contract tests verify contracts against `et-sya-api`:

```bash
# Run pact tests
yarn test:pact

# Run and publish pact verification
yarn test:pact:run-and-publish
```

### Accessibility (a11y) Tests

Accessibility auditing is performed using Pa11y and Playwright / Axe-core:

```bash
# Run Pa11y accessibility suite
yarn tests:a11y

# Run Playwright accessibility tests
yarn test:accessibility
```

### Functional & E2E Tests (Playwright)

End-to-end acceptance tests are powered by [Playwright](https://playwright.dev/):

```bash
# Run smoke tests
yarn test:smoke

# Run full functional test suite (Chromium / @RET-BAT)
yarn test:functional

# Cross-browser test runs
yarn test:functional-firefox
yarn test:functional-webkit
```

### CI Checks

Run the full CI pipeline check locally before pushing:

```bash
yarn cichecks
```

This runs dependency installation, build, linting, unit tests, and accessibility tests.

---

## Security

### CSRF Prevention

[Cross-Site Request Forgery](https://github.com/pillarjs/understanding-csrf) prevention is enforced globally via `csrf-csrf` middleware. Every HTML form must include the CSRF token:

```html
<form method="post" action="">
  <input type="hidden" name="_csrf" value="{{ csrfToken }}" />
  ...
</form>
```

### Helmet & Security Headers

[Helmet](https://helmetjs.github.io/) adds security-related HTTP headers to all responses (including `Content-Security-Policy` with per-request nonces, `Referrer-Policy`, and standard security protections).

### Google Tag Manager & Cookie Manager

This service implements strict Content Security Policy (CSP) nonce tokens for Google Tag Manager (GTM) script loading and dataLayer initialization:

- **Data Layer & Nonces**: A per-request nonce (`globals.nonce`) is generated by Express middleware and supplied in the CSP `script-src` directive as `'nonce-<token>'`.
- **GTM Injection**: `<meta name="gtm-one-time" content="{{ globals.nonce }}">> tag and `<script nonce="{{ globals.nonce }}">> tags are injected into page `<head>`.
- **Cookie Preferences**: User cookie consent preferences are managed via `@hmcts/cookie-manager` and synchronized with Google Tag Manager dataLayer (`cm-user-preferences`).

### Vulnerability Management

- Dependency audits are managed through Yarn resolutions (`package.json` `resolutions` block) and `yarn npm audit`.
- Nightly OWASP ZAP security scan alerts are suppressed or filtered via `audit.json` (matching alert fingerprints).
- Suppressed known advisories with no upstream release are documented in `yarn-audit-known-issues`.

---

## Healthcheck

The service exposes a health endpoint at `/health` (`https://localhost:3002/health`) using [@hmcts/nodejs-healthcheck](https://github.com/hmcts/nodejs-healthcheck). Health definitions are configured in `src/main/modules/health/index.ts`.

---

## Team & License

- **Responsible Team**: Employment Tribunals Reform Team
- **License**: This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
