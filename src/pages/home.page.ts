import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    readonly search: Locator;
    readonly localJapan: Locator;
    readonly consentBtn: Locator;
    readonly resultsBox: Locator;

    constructor(private readonly page: Page) {
        this.search = page.locator('input[data-testid="search-input"]');
        this.localJapan = page.locator('ul.countries-list li span[data-testid="Japan-name"]');
        this.consentBtn = page.locator('[id="onetrust-accept-btn-handler"]',);
        this.resultsBox = page.locator('ul.countries-list');
    }

    async goto() {
        await this.page.goto('https://www.airalo.com/');

        // Wait for consent button if present and click it
        await this.consentBtn.isVisible({ timeout: 10000 }).catch(() => false);
        await this.consentBtn.click();

    }

    async pickJapanLocal() {
        await this.search.fill('Japan');
        await this.resultsBox.waitFor({ state: 'visible', timeout: 10000 });
        await this.localJapan.click();
    }
}