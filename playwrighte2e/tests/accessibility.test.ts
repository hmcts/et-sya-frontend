import { AxeBuilder } from '@axe-core/playwright';
import { Page, expect } from '@playwright/test';

import { PageUrls } from '../../src/main/definitions/constants';
import { test } from '../fixtures/common.fixture';

const envUrl = process.env.TEST_URL || 'https://et-sya.aat.platform.hmcts.net';
const ignoredPages = ['/pension', '/pay', '/new-job-pay', '/compensation', PageUrls.CITIZEN_HUB];

async function expectNoErrors(page: Page): Promise<void> {
  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22a', 'wcag22aa'])
    .analyze();
  const errors = accessibilityScanResults.violations;

  if (errors.length > 0) {
    const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
    console.warn(`There are accessibility issues: \n${errorsAsJson}\n`);
  }

  expect(errors.length).toBe(0);
}

test.describe('SYA Accessibility', () => {
  Object.values({ ...PageUrls, CITIZEN_HUB: '/citizen-hub/a11y' }).forEach(url => {
    // testAccessibility(url);
    test(`Page ${url} should have no accessibility errors`, { tag: '@Accessibility' }, async ({ page }) => {
      if (!ignoredPages.includes(url)) {
        const pageUrl = envUrl + url;
        await page.goto(pageUrl);
        await expectNoErrors(page);
      }
    });
  });
});
