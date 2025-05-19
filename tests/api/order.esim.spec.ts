import { test, expect } from '@playwright/test';
import { api, buildOrderForm } from '../../src/api/airaloClient';
import { ORDERS } from '../../src/api/endpoints';

test('create one Kallur eSIM', async () => {
    const slug = 'kallur-digital-7days-1gb';
    const form = buildOrderForm(slug, 1, 'Desc Task5');

    const res = await api.post(ORDERS, form, { headers: form.getHeaders() });
    expect(res.status).toBe(200);
    expect(res.data.data.package_id).toBe(slug);
});

// basic happy-flow: order six “Merhaba” eSIMs
test('create bulk Merhaba order (6 × 1 GB / 7 days)', async () => {
    const slug     = 'merhaba-7days-1gb';
    const quantity = 6;

    const form = buildOrderForm(slug, quantity, 'bulk-api-exercise');

    const res  = await api.post(ORDERS, form, { headers: form.getHeaders() });
    const body = res.data.data;

    expect(res.status).toBe(200);
    expect(body.package_id).toBe(slug);
    expect(body.quantity).toBe(quantity);

    expect(body.sims).toHaveLength(quantity);
});