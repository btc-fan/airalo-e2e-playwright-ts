import { test, expect } from '@playwright/test';
import { api, buildOrderForm } from '../../src/api/airaloClient';
import { ORDERS } from '../../src/api/endpoints';

type Case = {
    name:         string;
    packageSlug:  string;
    qty:          number;
    expStatus:    number;
};

// bad payloads we expect the API to reject
const cases: Case[] = [
    { name: 'unknown package',        packageSlug: 'does-not-exist',       qty: 1,  expStatus: 422 },
    { name: 'qty = 0',                packageSlug: 'merhaba-7days-1gb',    qty: 0,  expStatus: 422 },
    { name: 'qty > 50 (API limit?)',  packageSlug: 'merhaba-7days-1gb',    qty: 99, expStatus: 422 },
];

test.describe('POST /orders – negative paths', () => {
    for (const c of cases) {
        test(`rejects when ${c.name}`, async () => {
            const form = buildOrderForm(c.packageSlug, c.qty, 'invalid-case');
            const res  = await api.post(ORDERS, form, { headers: form.getHeaders(), validateStatus: () => true });
            expect(res.status).toBe(c.expStatus);
        });
    }

    test('401 when token is missing', async () => {
        // same payload as a happy case, but call the raw axios instance without interceptors
        const form   = buildOrderForm('merhaba-7days-1gb', 1, 'no-token');
        const unauth = await api.postRaw(ORDERS, form, { headers: form.getHeaders(), validateStatus: () => true });
        expect(unauth.status).toBe(401);
    });
});
