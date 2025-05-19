import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    readonly search: Locator;
    readonly localJapan: Locator;
    readonly consentBtn: Locator;
    readonly resultsBox: Locator;

    constructor(private readonly page: Page) {
        this.search = page.locator('input[data-testid="search-input"]');
        this.localJapan = page.locator('ul.countries-list li span[data-testid="Japan-name"]');
        this.consentBtn = page.getByRole('button', { name: /accept/i });
        this.resultsBox = page.locator('ul.countries-list');
    }

    async goto() {
        await this.page.goto('https://www.airalo.com/', { waitUntil: 'networkidle' });

        // Handle cookie consent if present
        await this.consentBtn.click().catch(() => {});

        // Wait for the search input to be visible
        await this.page.waitForLoadState('domcontentloaded');
        await this.page.waitForSelector('input[data-testid="search-input"]', { state: 'visible', timeout: 15000 });
    }

    async pickJapanLocal() {
        await this.search.fill('Japan');
        await this.resultsBox.waitFor({ state: 'visible' });
        await this.localJapan.click();
    }
}