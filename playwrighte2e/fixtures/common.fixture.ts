import { test as baseTest } from '@playwright/test';

import { PageFixtures, pageFixtures } from './page.fixture';

export type customFixtures = PageFixtures;

export const test = baseTest.extend<customFixtures>({ ...pageFixtures });
