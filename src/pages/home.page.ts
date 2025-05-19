// src/pages/home.page.ts
import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    private readonly search:      Locator;
    private readonly localJapan:  Locator;
    private readonly consentBtn:  Locator;
    private readonly resultsBox: Locator;

    constructor(private readonly page: Page) {
        this.search     = page.locator('input[data-testid="search-input"]');
        this.localJapan = page.locator(
            'ul.countries-list li span[data-testid="Japan-name"]'
        );
        this.consentBtn = page.getByRole('button', { name: /accept/i });
        this.resultsBox = page.locator('ul.countries-list');
    }

    async goto() {
        await this.page.goto('https://www.airalo.com/', { waitUntil: 'domcontentloaded' });

        // dismiss cookie banner if it’s there
        if (await this.consentBtn.isVisible({ timeout: 2_000 }).catch(() => false))
            await this.consentBtn.click();

        await expect(this.search).toBeVisible({ timeout: 10_000 });
    }

    async pickJapanLocal() {
        await this.search.fill('Japan');
        await this.resultsBox.waitFor({ state: 'visible', timeout: 2_000 }).catch(async () => {
            // dropdown collapsed; try again
            await this.search.click();
            await this.resultsBox.waitFor({ state: 'visible', timeout: 10_000 });
        });
        await this.localJapan.click();
    }
}
