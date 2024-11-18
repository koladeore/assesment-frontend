import { test, expect } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// Derive __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UI_URL = 'http://localhost:5173/';

test.describe('User Management Tests', () => {
  test('Add User - Validate User Addition Workflow', async ({ page }) => {
    await page.goto(`${UI_URL}add-user`);

    // Assert that the "Add User" page loads correctly
    await expect(page).toHaveURL(`${UI_URL}add-user`);
    await expect(page.locator('h2')).toContainText('Add User');

    // Fill in the user details
    await page.fill('input#name', 'John Doe');
    await page.fill('input#email', 'john.doe@example.com');
    await page.selectOption('select#role', { label: 'Admin' });

    // Toggle the user status to active
    await page.click('label[for="status"]');

    // Upload a profile photo
    const filePath = path.resolve(__dirname, './assets/profile5.jpg');

    // Upload the profile photo
    await page.setInputFiles('input#profilePhoto', filePath);
    await expect(page.locator('img[alt="Profile"]')).toBeVisible();

    // Submit the form
    await page.click('button[type="submit"]');

    // Assert that a success toast appears
    await expect(page.locator('.Toastify__toast--success')).toContainText(
      'User added successfully!'
    );

    // Wait for redirection
    await page.waitForURL(UI_URL);
  });
  test('Get Users - Validate User List is Displayed', async ({ page }) => {
    await page.goto(UI_URL);

    // Assert the page has loaded correctly
    await expect(page).toHaveURL(UI_URL);
    await expect(page.locator('h1')).toContainText('User Profiles');

    // Check if the user list is visible
    const userCards = page.locator('.grid > div');
    await expect(await userCards.count()).toBeGreaterThan(0);

    // Check if the user list is visible
    const firstUserCard = userCards.first();
    await expect(
      firstUserCard.locator('[data-testid="user-name"]')
    ).toBeVisible();
    await expect(
      firstUserCard.locator('[data-testid="user-role"]')
    ).toBeVisible();
    await expect(
      firstUserCard.locator('[data-testid="user-status"]')
    ).toBeVisible();
    await expect(
      firstUserCard.locator('[data-testid="user-email"]')
    ).toBeVisible();
    await expect(
      firstUserCard.locator('[data-testid="user-image"]')
    ).toBeVisible();
  });
  test('Edit User - Validate User Update Workflow', async ({ page }) => {
    // Navigate to the "Manage Users" page
    await page.goto(`${UI_URL}manage-user`);

    // Assert the page has loaded correctly
    await expect(page).toHaveURL(`${UI_URL}manage-user`);
    await expect(page.locator('h1')).toContainText('Manage Users');

    // Click on the "Edit" button of the first user
    // Find the first user's edit button and click it
    const firstEditButton = page.locator('table tbody tr:first-child a', {
      hasText: 'Edit',
    });
    await expect(firstEditButton).toBeVisible();
    await firstEditButton.click();
    // Assert that the "Edit User" page loads correctly
    await expect(page).toHaveURL(/edit-user\/\d+/);
    await expect(page.locator('h2')).toContainText('Edit User');

    // Update user details
    await page.fill('input#name', 'Jane Doe');
    await page.fill('input#email', 'janedoe@gmail.com');
    await page.selectOption('select#role', { label: 'User' });

    // Toggle the status
    await page.click('label[for="status"]');

    // Submit the form
    await page.click('button[type="submit"]');

    // Assert that a success toast appears
    await expect(page.locator('.Toastify__toast--success')).toContainText(
      'User updated successfully'
    );

    // Wait for redirection
    await page.waitForURL(UI_URL);
  });
  test('Delete User - Validate User Deletion Workflow', async ({ page }) => {
    // Navigate to the "Manage Users" page
    await page.goto(`${UI_URL}manage-user`);

    // Assert the page has loaded correctly
    await expect(page).toHaveURL(`${UI_URL}manage-user`);
    await expect(page.locator('h1')).toContainText('Manage Users');

    // Find the last user's delete button and click it
    const lastDeleteButton = page.locator('table tbody tr:last-child button', {
      hasText: 'Delete',
    });
    await expect(lastDeleteButton).toBeVisible();
    await lastDeleteButton.click();

    // Wait for the confirmation modal to appear
    const confirmDeleteModal = page.locator('.fixed.bg-gray-800');
    await expect(confirmDeleteModal).toBeVisible();

    // Confirm deletion by clicking the "Yes, Delete" button
    const confirmButton = confirmDeleteModal.locator('button', {
      hasText: 'Yes, Delete',
    });
    await expect(confirmButton).toBeVisible();
    await confirmButton.click();

    // Assert that a success toast appears
    await expect(page.locator('.Toastify__toast--success')).toContainText(
      'User deleted successfully'
    );
    await page.reload();
  });
});
