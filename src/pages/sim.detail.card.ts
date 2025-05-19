import { Page, Locator, expect } from '@playwright/test';

export interface SimExpect {
    title:    string;
    coverage: string;
    data:     string;
    validity: string;
    price:    string;
}

export class SimDetailCard {
    private readonly root: Locator;

    constructor(page: Page) {
        this.root = page.locator('[data-testid="sim-detail-header"]').first();
    }

    async verify(exp: SimExpect) {
        await this.root.waitFor({ state: 'visible', timeout: 10_000 });

        await expect(this.root.getByTestId('sim-detail-operator-title'))
            .toHaveText(new RegExp(exp.title, 'i'));

        const info = this.root.locator('ul[data-testid="sim-detail-info-list"]');

        await expect(info.getByTestId('COVERAGE-value'))
            .toHaveText(new RegExp(exp.coverage, 'i'));

        await expect(info.getByTestId('DATA-value'))
            .toHaveText(new RegExp(exp.data, 'i'));

        await expect(info.getByTestId('VALIDITY-value'))
            .toHaveText(new RegExp(exp.validity, 'i'));

        await expect(info.getByTestId('PRICE-value'))
            .toHaveText(new RegExp(exp.price.replace(/\s+/g, ''), 'i'));
    }
}
