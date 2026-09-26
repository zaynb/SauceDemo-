import { test, expect } from './fixtures';
import { USERS, PASSWORD } from '../test-data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('valid user can log in', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(USERS.standard, PASSWORD);
    await inventoryPage.expectLoaded();
  });

  test('locked out user sees an error', async ({ loginPage }) => {
    await loginPage.login(USERS.lockedOut, PASSWORD);
    await loginPage.expectError('Sorry, this user has been locked out');
  });

  test('wrong password shows an error', async ({ loginPage }) => {
    await loginPage.login(USERS.standard, 'wrong_password');
    await loginPage.expectError('Username and password do not match');
  });

  test('empty username is required', async ({ loginPage }) => {
    await loginPage.loginButton.click();
    await loginPage.expectError('Username is required');
  });

  test('empty password is required', async ({ loginPage }) => {
    await loginPage.username.fill(USERS.standard);
    await loginPage.loginButton.click();
    await loginPage.expectError('Password is required');
  });

  test('user can log out', async ({ loggedIn, page, loginPage }) => {
    await loggedIn.logout();
    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });
});
