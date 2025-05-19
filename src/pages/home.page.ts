import { Page, Locator } from '@playwright/test';

export class HomePage {
    private search: Locator;
    private localJapan: Locator;

    constructor(private readonly page: Page) {
        this.search = page.locator('input[data-testid="search-input"]');
        this.localJapan = page.locator(
            'ul.countries-list li span[data-testid="Japan-name"]'
        );
    }

    async goto() {
        await this.page.goto('https://www.airalo.com/');
    }

    async pickJapanLocal() {
        await this.search.fill('Japan');
        await this.localJapan.waitFor({ state: 'visible', timeout: 10_000 }).catch(async () => {
            // dropdown collapsed; try again
            await this.search.click();
            await this.localJapan.waitFor({ state: 'visible', timeout: 10_000 });
        });
        await this.localJapan.click();
    }
}
