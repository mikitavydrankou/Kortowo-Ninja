import { test, expect } from '@playwright/test';
import { generateTestUser, waitForApp, clearAuth } from './fixtures/test-data.js';

test.describe('Full User Journey', () => {
  const user = generateTestUser();
  
  test.describe.configure({ mode: 'serial' });

  test('1. register new user', async ({ page }) => {
    await page.goto('/#/');
    await clearAuth(page);
    
    await page.goto('/#/signup');
    await page.waitForSelector('input', { timeout: 10000 });
    
    await page.getByLabel('Nickname').fill(user.username);
    await page.getByLabel(/Link do strony profilu/i).fill(user.link);
    await page.getByLabel('Hasło').fill(user.password);
    await page.locator('input[name="acceptedTerms"]').check();
    
    await page.getByRole('button', { name: /Załóż konto/i }).click();
    await page.waitForURL(/\/#\/$/, { timeout: 15000 });
    
    expect(page.url()).not.toContain('signup');
  });

  test('2. login with created account', async ({ page }) => {
    await page.goto('/#/signin');
    await page.waitForSelector('input', { timeout: 10000 });
    
    await page.getByLabel('Nickname').fill(user.username);
    await page.getByLabel('Hasło').fill(user.password);
    await page.getByRole('button', { name: /Zaloguj/i }).click();
    
    await page.waitForURL(/\/#\/$/, { timeout: 10000 });
    await expect(page.locator('main')).toBeVisible();
  });

  test('3. create offer', async ({ page }) => {
    await page.goto('/#/signin');
    await page.waitForSelector('input', { timeout: 5000 });
    await page.getByLabel('Nickname').fill(user.username);
    await page.getByLabel('Hasło').fill(user.password);
    await page.getByRole('button', { name: /Zaloguj/i }).click();
    await page.waitForURL(/\/#\/$/, { timeout: 10000 });
    
    await page.goto('/#/offer/create');
    await page.waitForTimeout(2000);
    
    const rulesCheckbox = page.locator('input[name="agreeToRules"]');
    if (await rulesCheckbox.count() === 0) return;
    
    await rulesCheckbox.check();
    
    const placeSelect = page.locator('[role="combobox"]').filter({ hasText: 'Wybierz akademik' });
    await placeSelect.scrollIntoViewIfNeeded();
    await placeSelect.click({ force: true });
    await page.getByRole('option', { name: 'DS1', exact: true }).click();
    
    await page.locator('input[name="title"]').fill(`E2E ${Date.now()}`);
    await page.locator('textarea[name="description"]').fill('E2E test');
    await page.locator('input[name="ttlHours"]').fill('24');
    await page.locator('input[name="counter_offer"]').fill('Test');
    
    await page.getByRole('button', { name: /Wyślij/i }).click();
    await page.waitForTimeout(3000);
  });

  test('4. view offers', async ({ page }) => {
    await page.goto('/#/');
    await waitForApp(page);
    await page.waitForTimeout(2000);
    
    const offerLink = page.locator('a[href*="/offer/"]').first();
    if (await offerLink.count() > 0) {
      await offerLink.click();
      await page.waitForURL(/offer\/\d+/, { timeout: 5000 });
    }
  });

  test('5. logout', async ({ page }) => {
    await page.goto('/#/signin');
    await page.waitForSelector('input', { timeout: 5000 });
    await page.getByLabel('Nickname').fill(user.username);
    await page.getByLabel('Hasło').fill(user.password);
    await page.getByRole('button', { name: /Zaloguj/i }).click();
    await page.waitForURL(/\/#\/$/, { timeout: 10000 });
    
    await page.getByText('Wyloguj się').click();
    await page.getByRole('button', { name: 'Wyloguj' }).click();
    await page.waitForTimeout(1000);
    
    await expect(page.getByRole('link', { name: 'Zaloguj się' })).toBeVisible();
  });

  test('6. unauthenticated cannot access create', async ({ page }) => {
    await page.goto('/#/offer/create');
    await page.waitForTimeout(2000);
    
    await expect(page.getByRole('link', { name: 'Zaloguj się' })).toBeVisible();
  });
});
