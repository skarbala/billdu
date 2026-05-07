import test, { expect } from "@playwright/test";

test.use({ storageState: 'auth.json' });

test.describe('Smoke', async () => {
    let invoiceData = {
        service: 'IT services',
        price: 10,
        client: 'Default',
        number: ''
    }

    test('create new invoice, send to an email', async ({ page }) => {
        await page.goto('https://my.billdu.com/company.documents.invoices.homepage/default');
        await test.step('Create new invoice', async () => {
            await page.getByTestId('btn-new').click()
            await page.getByTestId('name-client').click()
            await page.getByTestId('name-client').getByRole('combobox').fill(invoiceData.client);
            await page.getByRole('option', { name: 'Default' }).click();
            await page.getByTestId('name-label').fill(invoiceData.service);
            await page.getByTestId('name-price').fill(invoiceData.price.toString());
            await page.locator('#invoiceSaveButton').click();
            await page.waitForResponse('**/company.documents.invoices.edit/add')

        })
        await test.step('Check created invoice', async () => {
            await expect(page.locator('.invoice-number')).toHaveText(/\S+\s+\d+/);
            const text = await page.locator('.invoice-number').innerText();
            invoiceData.number = text.match(/\d+/)?.[0] ?? '';
            expect(invoiceData.number).toBeTruthy()
            await expect(page.getByText(invoiceData.service)).toBeVisible()
            await expect(page.getByRole('cell', { name: invoiceData.client })).toBeVisible()
        })

        await test.step('Check invoice can be sent to an email', async () => {
            await page.waitForTimeout(2000) //TODO: not proud about this one, probably need to wait until notification disappears
            await page.getByTestId('btn-send').click({ force: true })
            await page.locator('[data-testid="input-tags"]').fill('email@gmail.com') //TODO: these 2 selectors are quite ugly, need to fix this
            await page.locator('[id="mailFormSubmit"]').click()
            const response = await page.waitForResponse(
                response =>
                    response.url().includes('company.documents.invoices.view') &&
                    response.request().method() === 'POST' &&
                    response.request().postData()?.includes('_do=sendForm-form-submit') === true
            );
        })

    });

    test('create new client', async ({ page }) => {
        await page.goto('https://my.billdu.com/company.clients.homepage/default');
        await page.getByTestId('btn-new').click()
        await page.getByTestId('name-company').fill('Acme 123')
        await page.getByTestId('btn-save').click()
        await page.waitForResponse('**/company.clients.edit/add')
        await page.waitForURL('**company.clients.homepage/default')
    })

})