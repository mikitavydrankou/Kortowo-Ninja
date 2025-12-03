import { test, expect } from '@playwright/test';
import { waitForApp, clearAuth } from './fixtures/test-data.js';

test.describe('UI Structure', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/#/');
    await waitForApp(page);
    const content = await page.content();
    expect(content).toContain('root');
  });

  test('signin page has required fields', async ({ page }) => {
    await page.goto('/#/signin');
    await waitForApp(page);
    await expect(page.getByLabel(/Nickname/i)).toBeVisible();
    await expect(page.getByLabel(/Hasło/i)).toBeVisible();
  });

  test('signup page has required fields', async ({ page }) => {
    await page.goto('/#/signup');
    await waitForApp(page);
    await expect(page.locator('input').first()).toBeVisible();
  });
});
