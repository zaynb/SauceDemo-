import { test, expect } from './fixtures';

test.describe('Cart', () => {
  test('add one item updates the badge', async ({ loggedIn }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await expect(loggedIn.cartBadge).toHaveText('1');
  });

  test('add two items and see them in the cart', async ({ loggedIn, cartPage }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.addToCart('Sauce Labs Bike Light');
    await expect(loggedIn.cartBadge).toHaveText('2');

    await loggedIn.openCart();
    await cartPage.expectLoaded();
    await expect(cartPage.items).toHaveCount(2);
    await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
  });

  test('remove item clears the badge', async ({ loggedIn }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.removeFromCart('Sauce Labs Backpack');
    await expect(loggedIn.cartBadge).toHaveCount(0);
  });
});
