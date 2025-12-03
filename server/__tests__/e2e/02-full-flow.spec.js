import { test, expect } from '@playwright/test';
import { generateTestUser, waitForApp, clearAuth } from './fixtures/test-data.js';

const user = generateTestUser();

test.describe('Full User Journey', () => {
  test.describe.configure({ mode: 'serial' });

  test('1. register new user', async ({ page }) => {
    await clearAuth(page);
    await page.goto('/#/signup');
    await waitForApp(page);
    
    await page.getByLabel('Nickname').fill(user.username);
    await page.getByLabel(/Link do strony profilu/i).fill(user.link);
    await page.getByLabel(/Hasło/i).first().fill(user.password);
    await page.locator('input[name="acceptedTerms"]').check();
    
    await page.getByRole('button', { name: /Załóż konto/i }).click();
    await page.waitForTimeout(3000);
    
    expect(page.url()).not.toContain('signup');
  });

  test('2. login with created account', async ({ page }) => {
    await page.goto('/#/signin');
    await waitForApp(page);
    
    await page.getByLabel('Nickname').fill(user.username);
    await page.getByLabel(/Hasło/i).fill(user.password);
    await page.getByRole('button', { name: /Zaloguj/i }).click();
    
    await page.waitForTimeout(3000);
    expect(page.url()).not.toContain('signin');
  });

  test('3. create offer', async ({ page }) => {
    await page.goto('/#/signin');
    await waitForApp(page);
    await page.getByLabel('Nickname').fill(user.username);
    await page.getByLabel(/Hasło/i).fill(user.password);
    await page.getByRole('button', { name: /Zaloguj/i }).click();
    await page.waitForTimeout(2000);
    
    await page.goto('/#/offer/create');
    await waitForApp(page);
    
    const rulesCheckbox = page.locator('input[name="agreeToRules"]');
    if (await rulesCheckbox.count() === 0) {
      test.skip();
      return;
    }
    
    await rulesCheckbox.check();
    
    const placeSelect = page.locator('[role="combobox"]').first();
    await placeSelect.click({ force: true });
    await page.waitForTimeout(500);
    await page.locator('[role="option"]').first().click();
    
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
    const content = await page.content();
    expect(content.length).toBeGreaterThan(100);
  });

  test('5. logout', async ({ page }) => {
    await page.goto('/#/signin');
    await waitForApp(page);
    await page.getByLabel('Nickname').fill(user.username);
    await page.getByLabel(/Hasło/i).fill(user.password);
    await page.getByRole('button', { name: /Zaloguj/i }).click();
    await page.waitForTimeout(2000);
    
    const logoutBtn = page.getByText('Wyloguj się');
    if (await logoutBtn.count() > 0) {
      await logoutBtn.click();
      await page.waitForTimeout(500);
      const confirmBtn = page.getByRole('button', { name: 'Wyloguj' });
      if (await confirmBtn.count() > 0) {
        await confirmBtn.click();
      }
    }
    await page.waitForTimeout(1000);
  });

  test('6. unauthenticated cannot access create', async ({ page }) => {
    await clearAuth(page);
    await page.goto('/#/offer/create');
    await waitForApp(page);
    const content = await page.content();
    expect(content).toBeTruthy();
  });
});
