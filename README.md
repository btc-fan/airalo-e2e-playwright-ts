# Airalo E2E (Playwright + TypeScript) 

API and UI automation framework for the Airalo homework task.

## 1 · Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| **Node** | ≥ 20 | verified on 20.11 |
| **pnpm** | ≥ 8  | `npm i -g pnpm` |
| **Playwright browsers** | once via CLI | see step 2 |

## 2 · Clone & Install

```bash
git clone https://github.com/<your-user>/airalo-e2e-playwright-ts.git
cd airalo-e2e-playwright-ts
pnpm install                    # deps
pnpm exec playwright install    # chromium / firefox / webkit
```

## 3 · Environment variables

Create `configs/env/.env` (git-ignored):

```ini
# ───────── sandbox hosts ─────────
AIRALO_AUTH_URL=https:VALUE
AIRALO_BASE_URL=https:VALUE

# ───────── demo creds (task) ─────
AIRALO_CLIENT_ID=VALUE
AIRALO_CLIENT_SECRET=VALUE
```

*No root-level `.env` – the client loads from `configs/env`.*

## 4 · Run tests

| Scope            | Command |
|------------------|---------|
| **API**          | `pnpm run test:api` |
| **API negative** | `pnpm run test:api --grep @negative` |
| **UI**           | `pnpm run test:ui` |
| **All**          | `pnpm run test` |

`package.json` scripts:

```jsonc
{
  "test": "playwright test --config=configs/playwright.config.ts",
  "test:api": "playwright test --config=configs/playwright.config.ts --project=api",
  "test:ui": "playwright test --config=configs/playwright.config.ts --project=ui"
}
```

Headed / debug:

```bash
pnpm exec playwright test --project=ui --headed --slow-mo 100 \
  --config=configs/playwright.config.ts

# or:
PWDEBUG=1 pnpm run test:ui


The default UI project already starts non-headless at 1920 × 1080.
```

## 5 · Reports

```bash
# after any run
pnpm exec playwright show-report
```

*Interactive HTML* with traces, screenshots, videos.

## 6 · Structure

```bash
configs/
  ├─ env/.env
  └─ playwright.config.ts        # projects, reporters, viewport
src/
  ├─ api/
  │   ├─ airaloClient.ts         # Axios + token cache + helpers
  │   └─ endpoints.ts
  ├─ builders/
  │   └─ orderBuilder.ts         # buildOrderForm()
  └─ pages/                      # Playwright POMs
tests/
  ├─ api/
  │   ├─ auth.spec.ts            # token smoke
  │   ├─ order.kallur.spec.ts    # @positive
  │   ├─ sims.list.spec.ts       # @positive
  │   └─ negative.spec.ts        # @negative (401 / 422 etc.)
  └─ ui/
      └─ buy-japan.spec.ts
artifacts/                       # traces, videos, html (git-ignored)
```

## 7 · CI (GitHub Actions)

`.github/workflows/ci.yml`

```
A GitHub Actions workflow (.github/workflows/ci.yml) installs Node 20 + pnpm,
caches the pnpm store and Playwright browsers, runs all API & UI tests
headless, then uploads the HTML report and traces as an artifact.
```
