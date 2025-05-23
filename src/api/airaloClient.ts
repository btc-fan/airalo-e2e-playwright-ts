import axios from 'axios';
import FormData from 'form-data';
import * as dotenv from 'dotenv-flow';

dotenv.config({ path: 'configs/env' });

const {
    AIRALO_AUTH_URL,
    AIRALO_BASE_URL,
    AIRALO_CLIENT_ID,
    AIRALO_CLIENT_SECRET,
} = process.env;

let cachedToken = '';

async function getToken(): Promise<string> {
    if (cachedToken) return cachedToken;

    const body = new FormData();
    body.append('client_id', AIRALO_CLIENT_ID!);
    body.append('client_secret', AIRALO_CLIENT_SECRET!);

    const res = await axios.post(AIRALO_AUTH_URL!, body, {
        headers: body.getHeaders(),
        timeout: 10_000,
    });

    cachedToken = res.data.data.access_token;
    return cachedToken;
}

// expose a cached-JWT getter for specs
export const token = () => getToken();

export const api = axios.create({
    baseURL: `${AIRALO_BASE_URL}/v2`,
    timeout: 15_000,
    headers: { Accept: 'application/json' },
});

api.interceptors.request.use(async cfg => {
    cfg.headers = {
        ...cfg.headers,
        Authorization: `Bearer ${await getToken()}`,
    };
    return cfg;
});

// bare client – *no* interceptor, useful for 401 tests or bad tokens
export const apiRaw = axios.create({
    baseURL: `${AIRALO_BASE_URL}/v2`,
    timeout: 15_000,
    headers: { Accept: 'application/json' },
});

// expose helper methods on the same object so existing imports stay unchanged
Object.assign(api, {
    getRaw:  (url: string, cfg = {})            => apiRaw.get (url, cfg),
    postRaw: (url: string, data: any, cfg = {}) => apiRaw.post(url, data, cfg),
});

export const buildOrderForm = (slug: string, qty = 6, desc = 'auto') => {
    const fd = new FormData();
    fd.append('package_id', slug);
    fd.append('quantity', String(qty));
    fd.append('type', 'sim');
    fd.append('description', desc);
    fd.append('brand_settings_name', '');
    return fd;
};

