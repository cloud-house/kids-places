import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('should show login form and validate input', async ({ page }) => {
        await page.goto('/logowanie');

        await expect(page.getByLabel('Email')).toBeVisible();
        await expect(page.getByLabel('Hasło')).toBeVisible();

        const loginButton = page.getByRole('button', { name: 'Zaloguj się' });
        await loginButton.click();

        // Check for validation errors (assuming standard HTML5 or custom ones)
        // Since it's using React Hook Form + Zod, let's look for error messages
        await expect(page.getByText(/Invalid email|Password is required/i).first()).toBeVisible();
    });

    test('should show registration form and have navigation to login', async ({ page }) => {
        await page.goto('/rejestracja');

        await expect(page.getByRole('heading', { name: /Zarejestruj się|Stwórz konto/i }).or(page.getByText('Wybierz typ konta'))).toBeVisible();

        // Check if there is a link back to login
        const loginLink = page.getByRole('link', { name: /Zaloguj się/i });
        await expect(loginLink).toBeVisible();
    });

    test('should navigate to forgot password page', async ({ page }) => {
        await page.goto('/logowanie');
        await page.getByRole('link', { name: 'Zapomniałeś hasła?' }).click();

        await expect(page).toHaveURL(/.*zapomnialem-hasla/);
        await expect(page.getByRole('heading', { name: /Zapomniałeś hasła|Resetuj hasło/i }).or(page.getByText('Podaj swój adres email'))).toBeVisible();
    });
});
