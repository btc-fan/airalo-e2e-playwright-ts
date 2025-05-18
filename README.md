# Airalo E2E (Playwright + TypeScript)

API and UI automation skeleton for the Airalo homework task.

## 1 · Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node | ≥ 20 | tested on 20.11 |
| pnpm | ≥ 8  | `npm i -g pnpm` |
| Playwright browsers | installed once via CLI | see step 3 |

## 2 · Clone & Install

```bash
git clone https://github.com/<your-user>/airalo-e2e-playwright-ts.git
cd airalo-e2e-playwright-ts
pnpm install                    # deps
pnpm exec playwright install    # chromium / ff / webkit
```

## 3 · Environment variables

Create `configs/env/.env` (git-ignored) and paste:

```ini
# sandbox endpoints
AIRALO_AUTH_URL=https://sandbox-partners-api.airalo.com/v2/token
AIRALO_BASE_URL=https://sandbox-partners-api.airalo.com

# demo credentials from task
AIRALO_CLIENT_ID=<CLIENT_ID>
AIRALO_CLIENT_SECRET=<CLIENTT_SECRET>
```

If you move the file to repo root, just delete the path option in `src/api/airaloClient.ts`.

## 4 · Running tests

| Scope | Command |
|-------|---------|
| API only | `pnpm run test:api` |
| UI only | `pnpm run test:ui` (placeholder spec) |
| All | `pnpm run test` |

Scripts (`package.json`):

```jsonc
{
  "test":      "playwright test --config=configs/playwright.config.ts",
  "test:api":  "playwright test --config=configs/playwright.config.ts --project=api",
  "test:ui":   "playwright test --config=configs/playwright.config.ts --project=ui"
}
```

## 5 · Viewing reports

### 5.1 Playwright HTML

```bash
# after a run
pnpm exec playwright show-report
```

Opens an interactive dashboard with traces, videos, and screenshots.

## 6 · Folder layout

```
configs/
  ├─ env/.env                  # secrets
  └─ playwright.config.ts      # projects, reporters
src/
  api/                         # axios client, endpoint constants
  pages/                       # (placeholder) Playwright POMs
tests/
  api/                         # sims.list.spec.ts, order.kallur.spec.ts
  ui/                          # placeholder UI spec
artifacts/ (git-ignored)       # videos, traces, html
```

# PENDING 

## 7 · CI pipeline (GitHub Actions)

`.github/workflows/ci.yml`:
- Checkout → pnpm install
- pnpm exec playwright install --with-deps
- pnpm run test
- Upload `artifacts/` so HTML report is downloadable from each build.
- Add UI flows in `tests/ui/` using the Page-Object pattern under `src/pages/`.
- Use `buildOrderForm()` helper for any new `/orders` scenarios.
