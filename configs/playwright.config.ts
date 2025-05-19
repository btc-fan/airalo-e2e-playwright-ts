import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: '../tests',

    projects: [
        { name: 'api', testMatch: /tests\/api\/.*\.spec\.ts/ },
        {
            name: 'ui',
            testMatch: /tests\/ui\/.*\.spec\.ts/
        }
    ],

    reporter: [
        ['list'],
        ['html', { outputFolder: 'playwright-report', open: 'never' }]
    ],

    use: {
        headless: true,
        viewport: null,
        launchOptions: {
            args: ['--start-maximized']
        },
        trace: 'retain-on-failure'
    }
});
