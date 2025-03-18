
import { ClaimStartPage } from '../pages/claimStartPage';
import { LoginPage } from '../pages/loginPage';
import { SaveCardPage } from '../pages/saveCardPage';
import { MakeClaimPage } from '../pages/makeClaimPage';
import { PersonDetailsPage } from '../pages/personalDetailsPage'; 
import { EmploymentDetailsPage } from '../pages/employmentDetailsPage';
import { ClaimDetailsPage } from '../pages/claimDetailsPage';
import { SubmitPage } from '../pages/submitPage';
import { Page } from '@playwright/test';

export type PageFixtures = {

    claimStartPage: ClaimStartPage;
    loginPage: LoginPage;
    saveCardPage: SaveCardPage;
    makeClaimPage: MakeClaimPage;
    personalDetailsPage: PersonDetailsPage;
    employmentDetailsPage: EmploymentDetailsPage;
    claimDetailsPage: ClaimDetailsPage;
    submitPage: SubmitPage;
}

export const pageFixtures = {
    claimStartPage: async ({ page }: { page: Page }, use: (page: ClaimStartPage) => Promise<void>) => {
        await use(new ClaimStartPage(page));
    },

    loginPage: async ({ page }: { page: Page }, use: (page: LoginPage) => Promise<void>) => {
        await use(new LoginPage(page));
    },

    saveCardPage: async ({ page }: { page: Page }, use: (page: SaveCardPage) => Promise<void>) => {
        await use(new SaveCardPage(page));
    },

    makeClaimPage: async ({ page }: { page: Page }, use: (page: MakeClaimPage) => Promise<void>) => {
        await use(new MakeClaimPage(page));
    },

    personalDetailsPage: async ({ page }: { page: Page }, use: (page: PersonDetailsPage) => Promise<void>) => {
        await use(new PersonDetailsPage(page));
    },

    employmentDetailsPage: async ({ page }: { page: Page }, use: (page: EmploymentDetailsPage) => Promise<void>) => {
        await use(new EmploymentDetailsPage(page));
    },

    claimDetailsPage: async ({ page }: { page: Page }, use: (page: ClaimDetailsPage) => Promise<void>) => {
        await use(new ClaimDetailsPage(page));
    },

    submitPage: async ({ page }: { page: Page }, use: (page: SubmitPage) => Promise<void>) => {
        await use(new SubmitPage(page));
    },
    
};