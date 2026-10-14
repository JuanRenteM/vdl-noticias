import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  reporter: [['list'], ['json', { outputFile: 'test-results/resumen.json' }]],
  use: { baseURL: process.env['E2E_BASE_URL'] || 'http://127.0.0.1:4200', viewport: { width: 1366, height: 900 }, trace: 'retain-on-failure' },
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }]
});
