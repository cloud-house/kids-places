import { test, expect } from '@playwright/test';

test.describe('Search and Filters', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/miejsca');
    });

    test('should search by keyword', async ({ page }) => {
        const searchInput = page.locator('#search');
        await searchInput.fill('kawa');
        await searchInput.press('Enter');

        await expect(page).toHaveURL(/.*q=kawa/);
        // Wait for results to update (assuming some loading state or just checking URL is enough for now)
        // In a real scenario, we'd check if results contain the keyword
    });

    test('should filter by city', async ({ page }) => {
        // Find the city select trigger
        await page.getByPlaceholder('Wybierz miasto').click();

        // Select Warszawa (assuming it exists in CITIES)
        await page.getByRole('option', { name: 'Warszawa' }).click();

        await expect(page).toHaveURL(/.*city=Warszawa/);
    });

    test('should filter by category', async ({ page }) => {
        // Find a category button
        const categoryButton = page.getByRole('button').filter({ hasText: /Kawiarnie|Restauracje|Sale zabaw/ }).first();
        const categoryName = await categoryButton.innerText();

        await categoryButton.click();

        // Check if URL contains category (slug might be different, but let's check if it updates)
        await expect(page).toHaveURL(/.*category=/);
    });

    test('should clear filters', async ({ page }) => {
        await page.locator('#search').fill('test');
        await page.locator('#search').press('Enter');

        const clearButton = page.getByRole('button', { name: 'Wyczyść' });
        await expect(clearButton).toBeVisible();

        await clearButton.click();

        await expect(page.locator('#search')).toHaveValue('');
        await expect(page).not.toHaveURL(/.*q=test/);
    });
});
