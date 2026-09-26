import { test, expect } from '../tests/fixtures';
import { USERS, PASSWORD, CUSTOMER } from '../test-data/users';

/**
 * End-to-End (E2E) test: one real customer journey from start to finish.
 * Unlike the small tests in /tests (one feature each), this follows a user
 * through the whole shop: login -> browse -> cart -> checkout -> logout.
 */
test.describe('E2E - Customer purchase journey', () => {
  test('customer buys 2 products and completes the order', async ({
    page, loginPage, inventoryPage, cartPage, checkoutPage,
  }) => {
    const products = ['Sauce Labs Backpack', 'Sauce Labs Bolt T-Shirt', 'Sauce Labs Onesie'];

    await test.step('1. Log in as a standard customer', async () => {
      await loginPage.goto();
      await loginPage.login(USERS.standard, PASSWORD);
      await inventoryPage.expectLoaded();
    });

    await test.step('2. Browse: sort products by price (low to high)', async () => {
      await inventoryPage.sortBy('lohi');
      const prices = await inventoryPage.getPrices();
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    await test.step('3. Add 3 products to the cart', async () => {
      for (const name of products) {
        await inventoryPage.addToCart(name);
      }
      await expect(inventoryPage.cartBadge).toHaveText('3');
    });

    await test.step('4. Change of mind: remove one product', async () => {
      await inventoryPage.removeFromCart('Sauce Labs Bolt T-Shirt');
      await expect(inventoryPage.cartBadge).toHaveText('2');
    });

    await test.step('5. Review the cart', async () => {
      await inventoryPage.openCart();
      await cartPage.expectLoaded();
      await expect(cartPage.itemNames).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Onesie']);
    });

    await test.step('6. Checkout: enter customer info', async () => {
      await cartPage.checkout();
      await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
      await expect(page).toHaveURL(/checkout-step-two\.html/);
    });

    await test.step('7. Verify the price summary', async () => {
      const { subtotal, tax, total } = await checkoutPage.getSummary();
      expect(subtotal).toBeCloseTo(29.99 + 7.99, 2);   // Backpack + Onesie
      expect(tax).toBeGreaterThan(0);
      expect(total).toBeCloseTo(subtotal + tax, 2);
    });

    await test.step('8. Place the order', async () => {
      await checkoutPage.finish();
      await checkoutPage.expectComplete();
    });

    await test.step('9. Back to products: cart is empty', async () => {
      await page.getByTestId('back-to-products').click();
      await inventoryPage.expectLoaded();
      await expect(inventoryPage.cartBadge).toHaveCount(0);
    });

    await test.step('10. Log out', async () => {
      await inventoryPage.logout();
      await expect(loginPage.loginButton).toBeVisible();
    });
  });
});
