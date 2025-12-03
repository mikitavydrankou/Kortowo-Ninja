export const generateTestUser = () => {
  const ts = Date.now();
  return {
    username: `e2e_${ts}`,
    password: 'TestPassword123!',
    link: `https://www.facebook.com/profile.php?id=${ts}`
  };
};

export const waitForApp = async (page) => {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForSelector('#root', { timeout: 15000 });
  await page.waitForTimeout(500);
};

export const clearAuth = async (page) => {
  await page.evaluate(() => localStorage.removeItem('auth-storage'));
};
