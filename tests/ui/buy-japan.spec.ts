import { test } from '@playwright/test';
import { HomePage } from '../../src/pages/home.page';
import { PackageListPage } from '../../src/pages/package-list.page';
import { SimDetailCard } from "../../src/pages/sim.detail.card";

test('second Moshi Moshi package shows correct details', async ({ page }) => {
    const home  = new HomePage(page);
    const list  = new PackageListPage(page);
    const card  = new SimDetailCard(page);

    await home.goto();
    await home.pickJapanLocal();

    await list.buyNowOnCard(1);
    await card.verify({
        title: 'Moshi Moshi',
        coverage: 'Japan',
        data: '1 GB',
        validity: '7 Days',
        price: '4.50'
    });
});
