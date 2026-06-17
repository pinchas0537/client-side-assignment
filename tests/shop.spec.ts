import { test, expect } from "@playwright/test";

test("test E2E", async ({ page }) => {
    await page.goto("http://localhost:5173");
    await expect(page).toHaveTitle(/temp-app/);
    const buttons = page.getByTitle("הוסף לעגלה");
    const count = await buttons.count();
    for (let i = 0; i < count; i++) {
        await buttons.nth(i).click()
        await expect(page.getByText("המוצר נוסף לעגלה!").last()).toBeVisible();
        await expect(page.getByRole("link", { name: "עגלה" }).getByText(`${i+1}`)).toBeVisible();
    }
    await page.getByRole("link", { name: "עגלה" }).click();
    await page.getByRole("button", { name: "מעבר לתשלום" }).click();
    await expect(page.getByText("ההזמנה בוצעה בהצלחה!")).toBeVisible();
});
