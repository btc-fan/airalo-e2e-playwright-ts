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
