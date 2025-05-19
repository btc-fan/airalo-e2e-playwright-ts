import { Page, Locator } from '@playwright/test';

export class PackageListPage {
    private cards: Locator;

    constructor(private readonly page: Page) {
        this.cards = page.locator('a[data-testid="sim-package-item"]');
    }

    /** one-liner that clicks BUY NOW inside the N-th card (0-based) */
    async buyNowOnCard(index: number) {
        const card = this.cards.nth(index);
        const buyNowBtn = card.getByRole('button', { name: /buy now|get free esim/i });
        await buyNowBtn.scrollIntoViewIfNeeded();
        await buyNowBtn.click();
    }
}
