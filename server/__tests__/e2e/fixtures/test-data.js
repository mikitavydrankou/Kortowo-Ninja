export const generateTestUser = () => ({
  username: `test_${Date.now()}_${Math.random().toString(36).substring(7)}`,
  password: 'TestPassword123!',
  link: `https://www.facebook.com/profile.php?id=${Date.now()}${Math.floor(Math.random() * 10000)}`
});

export const waitForApp = async (page) => {
  await page.waitForSelector('#root > *', { timeout: 10000 });
};

export const clearAuth = async (page) => {
  await page.evaluate(() => localStorage.removeItem('auth-storage'));
};
