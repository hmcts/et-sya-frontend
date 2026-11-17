import { test as baseTest } from '@hmcts/et-shared-test-library';

export const test = baseTest.extend({});

let startTime: number;

test.beforeEach(async ({}, testInfo) => {
  startTime = Date.now();
  if (!process.env.CI) {
    console.log(`Running test: ${testInfo.title}`);
  }
});

test.afterEach(async () => {
  const duration = Date.now() - startTime;
  if (!process.env.CI) {
    console.log(`Test duration: ${duration}ms`);
  }
});
