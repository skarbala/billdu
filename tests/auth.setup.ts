import { test as setup } from '@playwright/test'

setup('authenticate', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Accept' }).click()
    await page.getByRole('textbox', { name: 'Your email address' }).fill('skarbala.martin@gmail.com')
    await page.getByRole('button', { name: 'Continue' }).click()

    await page.getByRole('textbox', { name: 'Enter password' }).fill('Furboslav123!')
    await page.getByRole('button', { name: 'Sign in' }).click()

    await page.context().storageState({ path: 'auth.json' });
})