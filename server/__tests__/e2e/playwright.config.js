import { defineConfig } from '@playwright/test';

const apiPort = Number(process.env.API_PORT || 3000);
const frontendPort = Number(process.env.E2E_FRONTEND_PORT || 5173);
const baseURL = process.env.E2E_BASE_URL || `http://localhost:${frontendPort}`;

export default defineConfig({
  testDir: './',
  timeout: 60000,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    headless: true,
    screenshot: 'only-on-failure',
    video: 'off',
    trace: 'on-first-retry',
    actionTimeout: 10000,
    navigationTimeout: 20000,
  },
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 },
        launchOptions: {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
          ],
        },
      },
    },
  ],
  webServer: [
    {
      command: 'npm run start:ci',
      port: apiPort,
      timeout: 120000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: `npm --prefix ../client run preview -- --host 0.0.0.0 --port ${frontendPort}`,
      port: frontendPort,
      timeout: 120000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});