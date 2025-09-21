import { test, expect } from '@playwright/test';

test('navigates between routes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome' })).toBeVisible();

  await page.getByRole('link', { name: 'Article' }).click();
  await expect(page.getByRole('heading', { name: /Article/i })).toBeVisible();

  await page.getByRole('link', { name: 'Table' }).click();
  await expect(page.getByRole('heading', { name: 'Table' })).toBeVisible();
});
