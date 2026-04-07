import { test, expect } from '@playwright/test';

test.describe('Details and Navigation', () => {
    test('should navigate from places list to a place detail page', async ({ page }) => {
        await page.goto('/miejsca');

        // Wait for cards to be visible
        const firstCard = page.locator('article').first();
        await expect(firstCard).toBeVisible({ timeout: 15000 });

        const placeName = await firstCard.locator('h3').innerText();
        await firstCard.getByRole('link').first().click();

        // Verify we are on the detail page
        await expect(page.getByRole('heading', { name: placeName })).toBeVisible();
        // Check for common details page elements
        await expect(page.getByText(/Opis|Informacje/i).first()).toBeVisible();
        await expect(page.locator('.leaflet-container').or(page.getByText(/Lokalizacja/i))).toBeVisible();
    });

    test('should navigate from events list to an event detail page', async ({ page }) => {
        await page.goto('/wydarzenia');

        const firstCard = page.locator('article').first();
        await expect(firstCard).toBeVisible({ timeout: 15000 });

        const eventName = await firstCard.locator('h3').innerText();
        await firstCard.getByRole('link').first().click();

        await expect(page.getByRole('heading', { name: eventName })).toBeVisible();
    });

    test('should navigate from classes list to a class detail page', async ({ page }) => {
        await page.goto('/zajecia');

        const firstCard = page.locator('article').first();
        await expect(firstCard).toBeVisible({ timeout: 15000 });

        const className = await firstCard.locator('h3').innerText();
        await firstCard.getByRole('link').first().click();

        await expect(page.getByRole('heading', { name: className })).toBeVisible();
    });
});
