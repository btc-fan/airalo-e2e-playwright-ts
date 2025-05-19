import { test, expect } from '@playwright/test';
import { token } from '../../src/api/airaloClient';

test('can fetch a valid OAuth2 token', async () => {
    const jwt = await token();          // cached getter
    // basic “looks-like-a-JWT” check: 3 dot-separated Base64URL segments
    expect(jwt.split('.').length).toBe(3);
});