import { test, expect } from '@playwright/test';
import {
  ARTICLE_PAGE_IDS,
  HOME_PAGE_COPY,
  NAVIGATION_COPY,
  TABLE_PAGE_COPY,
} from '@/constants';

test('navigates between routes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: HOME_PAGE_COPY.TITLE })).toBeVisible();

  await page.getByRole('link', { name: NAVIGATION_COPY.ARTICLE }).click();
  await expect(page.locator(`#${ARTICLE_PAGE_IDS.TITLE}`)).toBeVisible();

  await page.getByRole('link', { name: NAVIGATION_COPY.TABLE }).click();
  await expect(page.getByRole('heading', { name: TABLE_PAGE_COPY.TITLE })).toBeVisible();
});
