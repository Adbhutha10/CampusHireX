import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should show login page with login links', async ({ page }) => {
    await page.goto('/');
    
    // Check for login links in the navbar
    await expect(page.getByText('Student Login')).toBeVisible();
    await expect(page.getByText('Admin Login')).toBeVisible();
  });

  test('should navigate to admin login', async ({ page }) => {
    await page.goto('/');
    await page.getByText('Admin Login').click();
    
    await expect(page).toHaveURL(/.*role=ADMIN/);
    await expect(page.getByRole('heading', { name: 'Login to CampusHireX' })).toBeVisible();
  });
});
