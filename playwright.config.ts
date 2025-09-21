import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: 'src/__tests__/e2e',
  webServer: { command: 'npm run dev', port: 5173, reuseExistingServer: !process.env.CI },
  use: { baseURL: 'http://localhost:5173' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
});
