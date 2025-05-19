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

## 7 · Overview of test implementation

| Area | Test case | Approach / Assertions |
|------|-----------|------------------------|
| **Auth** | Fetch OAuth2 token | `POST /token` once; response cached in `airaloClient.ts`. Assert `200` and JWT prefix `eyJ`. |
| **API positive** | Create Kallur eSIM | `POST /orders` with dynamic multipart form from `buildOrderForm()`. Assert `200` and `package_id`. |
| | Bulk Merhaba order (6 SIMs) | Same endpoint, `quantity = 6`, expect `201/200` and array of 6 SIMs. |
| | List SIMs | `GET /sims` page 1 – expect pagination meta and 25 records; secondary test filters for 6 fresh "Merhaba" SIMs. |
| **API negative** | `/orders` bad slug / invalid qty / >50 qty / missing token | Parameterised table tests (`@negative` tag) expecting `422` or `401`. |
| | `/sims` bad page / missing token | Expect `400` (validation) or `401`. |
| **UI** | Search "Japan" → pick 2nd Moshi Moshi | Page-Objects: `HomePage` (search + cookie consent), `PackageListPage` (card index), `SimDetailCard` (header + row assertions). Assertions cover title, coverage, data, validity, price. **Note:** Cloudflare intermittently blocks GitHub-hosted browsers; see section 9. |

## 8 · CI (GitHub Actions)
The workflow `.github/workflows/e2e.yml`

```yaml
steps:
  - checkout
  - pnpm/action-setup@v3
  - actions/setup-node@v4 (cache=pnpm)
  - run: pnpm install
  - run: pnpm exec playwright install --with-deps
  - run: pnpm exec playwright test --config=configs/playwright.config.ts
    continue-on-error: true # keep job alive to publish report
  - uses: actions/upload-artifact@v4
    with:
      name: playwright-report
      path: |
        playwright-report
        test-results/**/*.zip
```
*The job fails **after** the report is uploaded if any test failed.*

## 9 · Cloudflare note (UI tests in CI)
`airalo.com` is behind Cloudflare. Headless Chromium on GitHub-Actions occasionally receives a *"Sorry, you have been blocked"* page, breaking UI tests while API tests continue to pass. Work-arounds (not yet committed):
* run UI flow against a staging host (if available)
* execute CI on a self-hosted runner with a stable IP allow-listed in Cloudflare
* use Playwright's `--proxy-server` with a residential proxy