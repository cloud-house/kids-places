import { test, expect } from '@playwright/test';

test.describe('Portal Smoke Tests', () => {
    test('Home page should load with correct heading', async ({ page }) => {
        await page.goto('/');
        const heading = page.getByRole('heading', { name: 'Wszystkie przygody Twojego dziecka w jednym miejscu' });
        await expect(heading).toBeVisible();
    });

    test('Places page should load', async ({ page }) => {
        await page.goto('/miejsca');
        await expect(page).toHaveURL(/.*miejsca/);
        // Should have some content or a filter sidebar
        await expect(page.getByText('Filtry')).toBeVisible({ timeout: 10000 });
    });

    test('Events page should load', async ({ page }) => {
        await page.goto('/wydarzenia');
        await expect(page).toHaveURL(/.*wydarzenia/);
        await expect(page.getByRole('heading', { name: 'Wydarzenia dla dzieci' }).or(page.getByText('Wydarzenia'))).toBeVisible();
    });

    test('Classes page should load', async ({ page }) => {
        await page.goto('/zajecia');
        await expect(page).toHaveURL(/.*zajecia/);
        await expect(page.getByRole('heading', { name: 'Zajęcia dla dzieci' }).or(page.getByText('Zajęcia'))).toBeVisible();
    });

    test('Pricing page should load', async ({ page }) => {
        await page.goto('/cennik');
        await expect(page).toHaveURL(/.*cennik/);
        await expect(page.getByRole('heading', { name: /Cennik|Wybierz plan/i })).toBeVisible();
    });

    test('Contact page should load', async ({ page }) => {
        await page.goto('/kontakt');
        await expect(page).toHaveURL(/.*kontakt/);
        await expect(page.getByRole('heading', { name: /Kontakt|Napisz do nas/i })).toBeVisible();
    });
});
