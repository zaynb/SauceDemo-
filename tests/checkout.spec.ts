import { test, expect } from './fixtures';
import { CUSTOMER } from '../test-data/users';

test.describe('Checkout', () => {
  test('complete an order end to end', async ({ loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');   // $29.99
    await loggedIn.addToCart('Sauce Labs Onesie');      // $7.99
    await loggedIn.openCart();
    await cartPage.checkout();

    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);

    const { subtotal, tax, total } = await checkoutPage.getSummary();
    expect(subtotal).toBeCloseTo(29.99 + 7.99, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);

    await checkoutPage.finish();
    await checkoutPage.expectComplete();
  });

  test('first name is required', async ({ loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo('', CUSTOMER.lastName, CUSTOMER.postalCode);
    await expect(checkoutPage.error).toContainText('First Name is required');
  });

  test('last name is required', async ({ loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CUSTOMER.firstName, '', CUSTOMER.postalCode);
    await expect(checkoutPage.error).toContainText('Last Name is required');
  });

  test('can correct missing information and complete checkout', async ({
    loggedIn,
    cartPage,
    checkoutPage,
  }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.openCart();
    await cartPage.checkout();

    await checkoutPage.fillInfo('', CUSTOMER.lastName, CUSTOMER.postalCode);
    await expect(checkoutPage.error).toContainText('First Name is required');

    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, CUSTOMER.postalCode);
    await expect(checkoutPage.subtotal).toBeVisible();
    await checkoutPage.finish();
    await checkoutPage.expectComplete();
  });

  test('postal code is required', async ({ loggedIn, cartPage, checkoutPage }) => {
    await loggedIn.addToCart('Sauce Labs Backpack');
    await loggedIn.openCart();
    await cartPage.checkout();
    await checkoutPage.fillInfo(CUSTOMER.firstName, CUSTOMER.lastName, '');
    await expect(checkoutPage.error).toContainText('Postal Code is required');
  });
});
