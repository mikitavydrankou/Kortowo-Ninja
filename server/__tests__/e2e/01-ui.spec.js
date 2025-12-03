import { test, expect } from '@playwright/test';
import { waitForApp, clearAuth } from './fixtures/test-data.js';

test.describe('UI Structure', () => {
  test('homepage loads with navigation', async ({ page }) => {
    await page.goto('/#/');
    await waitForApp(page);

    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('[class*="BottomNavigation"]').first()).toBeVisible();
  });

  test('signin page has required fields', async ({ page }) => {
    await page.goto('/#/signin');
    await page.waitForSelector('input', { timeout: 10000 });

    await expect(page.getByLabel('Nickname')).toBeVisible();
    await expect(page.getByLabel('Hasło')).toBeVisible();
    await expect(page.getByRole('button', { name: /Zaloguj/i })).toBeVisible();
  });

  test('signup page has required fields', async ({ page }) => {
    await page.goto('/#/signup');
    await page.waitForSelector('input', { timeout: 10000 });

    await expect(page.getByRole('heading', { name: /Załóż konto/i })).toBeVisible();
    await expect(page.locator('input[name="acceptedTerms"]')).toBeVisible();
    expect(await page.locator('input').count()).toBeGreaterThanOrEqual(3);
  });

  test('offer cards displayed on homepage', async ({ page }) => {
    await page.goto('/#/');
    await waitForApp(page);
    await page.waitForTimeout(2000);

    const cards = page.locator('[class*="Card"], [class*="MuiCard"]');
    const empty = page.locator('text=/brak|puste|empty/i');
    expect((await cards.count()) > 0 || (await empty.count()) > 0).toBeTruthy();
  });

  test('unauthenticated user sees login button', async ({ page }) => {
    await page.goto('/#/');
    await clearAuth(page);
    await page.reload();
    await waitForApp(page);

    await expect(page.locator('a[href*="signin"]').first()).toBeVisible();
  });
});
