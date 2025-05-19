import { test, expect } from '@playwright/test';
import { api } from '../../src/api/airaloClient';
import { SIMS_LIST } from '../../src/api/endpoints';

test('page 1 returns 25 sims', async () => {
    const res = await api.get(SIMS_LIST);
    expect(res.status).toBe(200);

    const { data, meta } = res.data;
    expect(meta.current_page).toBe(1);
    expect(+meta.per_page).toBe(25);
    expect(data.length).toBe(25);
});

// verify the Merhaba batch is now visible in /sims
test('latest list shows six fresh Merhaba SIMs', async () => {
    const res = await api.get(SIMS_LIST);
    expect(res.status).toBe(200);

    const sims = res.data.data.slice(0, 6);
    expect(sims).toHaveLength(6);

    // every SIM should come from the Merhaba package
    sims.forEach(sim => {
        expect(sim.matching_id).toBe('TEST');
    });
});