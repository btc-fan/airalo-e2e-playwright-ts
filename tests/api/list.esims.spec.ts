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
