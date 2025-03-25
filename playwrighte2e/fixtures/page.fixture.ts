import { Page } from '@playwright/test';

import { ClaimDetailsPage } from '../pages/claimDetailsPage';
import { ClaimStartPage } from '../pages/claimStartPage';
import { EmploymentDetailsPage } from '../pages/employmentDetailsPage';
import { LoginPage } from '../pages/loginPage';
import { MakeClaimPage } from '../pages/makeClaimPage';
import { PersonDetailsPage } from '../pages/personalDetailsPage';
import { SaveCardPage } from '../pages/saveCardPage';
import { SubmitPage } from '../pages/submitPage';

export type PageFixtures = {
  claimStartPage: ClaimStartPage;
  loginPage: LoginPage;
  saveCardPage: SaveCardPage;
  makeClaimPage: MakeClaimPage;
  personalDetailsPage: PersonDetailsPage;
  employmentDetailsPage: EmploymentDetailsPage;
  claimDetailsPage: ClaimDetailsPage;
  submitPage: SubmitPage;
};

export const pageFixtures = {
  claimStartPage: async ({ page }: { page: Page }, use: (page: ClaimStartPage) => Promise<void>): Promise<void> => {
    await use(new ClaimStartPage(page));
  },

  loginPage: async ({ page }: { page: Page }, use: (page: LoginPage) => Promise<void>): Promise<void> => {
    await use(new LoginPage(page));
  },

  saveCardPage: async ({ page }: { page: Page }, use: (page: SaveCardPage) => Promise<void>): Promise<void> => {
    await use(new SaveCardPage(page));
  },

  makeClaimPage: async ({ page }: { page: Page }, use: (page: MakeClaimPage) => Promise<void>): Promise<void> => {
    await use(new MakeClaimPage(page));
  },

  personalDetailsPage: async (
    { page }: { page: Page },
    use: (page: PersonDetailsPage) => Promise<void>
  ): Promise<void> => {
    await use(new PersonDetailsPage(page));
  },

  employmentDetailsPage: async (
    { page }: { page: Page },
    use: (page: EmploymentDetailsPage) => Promise<void>
  ): Promise<void> => {
    await use(new EmploymentDetailsPage(page));
  },

  claimDetailsPage: async ({ page }: { page: Page }, use: (page: ClaimDetailsPage) => Promise<void>): Promise<void> => {
    await use(new ClaimDetailsPage(page));
  },

  submitPage: async ({ page }: { page: Page }, use: (page: SubmitPage) => Promise<void>): Promise<void> => {
    await use(new SubmitPage(page));
  },
};
