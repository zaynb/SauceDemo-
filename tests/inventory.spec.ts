import { test, expect } from './fixtures';

test.describe('Products', () => {
  test('shows 6 products', async ({ loggedIn }) => {
    await expect(loggedIn.items).toHaveCount(6);
  });

  test('sort by name Z to A', async ({ loggedIn }) => {
    await loggedIn.sortBy('za');
    const names = await loggedIn.itemNames.allTextContents();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('sort by price low to high', async ({ loggedIn }) => {
    await loggedIn.sortBy('lohi');
    const prices = await loggedIn.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by price high to low', async ({ loggedIn }) => {
    await loggedIn.sortBy('hilo');
    const prices = await loggedIn.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});
