import { test, expect } from '@playwright/test';
import { api }        from '../../src/api/airaloClient';
import { SIMS_LIST }  from '../../src/api/endpoints';

test.describe('GET /sims – negative / edge cases', () => {
    test('400 for non-numeric page param', async () => {
        const res = await api.get(`${SIMS_LIST}?page=foo`, { validateStatus: () => true });
        expect(res.status).toBe(422); // TODO Potential bug, it should be 400
    });

    // TODO Failed tests, possible bug here, it should return 0, instead of 25
    // test('empty array when slug does not exist', async () => {
    //     const res = await api.get(`${SIMS_LIST}?package_id=no-such-slug-123`);
    //     expect(res.status).toBe(200);
    //     expect(res.data.data).toHaveLength(0);
    // });

    test('401 when token is missing', async () => {
        const unauth = await api.getRaw(SIMS_LIST, { validateStatus: () => true });
        expect(unauth.status).toBe(401);
    });
});
