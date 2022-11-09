/**
 * @jest-environment node
 */

import { Browser, Page, chromium } from 'playwright';

import { app } from '../../../../main/app';

describe('test csrf', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await chromium.launch();
    return async () => {
      await browser.close();
    };
  });

  beforeEach(async () => {
    app.locals.CSRF_DISABLED = false;
    page = await browser.newPage({ ignoreHTTPSErrors: true });
    await page.goto('https://localhost:3001/work-postcode');

    return async () => {
      await page.close();
    };
  });

  test('should fail when csrf is altered', async () => {
    await page.route(
      () => true,
      route => {
        route.continue({ headers: { _csrf: '' } });
      }
    );

    await page.locator('.govuk-input').type('OL14 7DE');
    await page.locator('button >> text=Continue').click();

    expect(await page.title()).toBe('Not Found - Employment Tribunals - GOV.UK');
  });

  test('should work when csrf is unchanged', async () => {
    await page.locator('.govuk-input').type('OL14 7DE');
    await page.locator('button >> text=Continue').click();

    expect(await page.title()).toBe('My own claim or representative - Employment Tribunals - GOV.UK');
  });
});
