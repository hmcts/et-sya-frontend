import { expect } from 'chai';
import { app } from '../../../main/app';
import request from 'supertest';

import fs from 'fs';
import path from 'path';

const multipleRespondentJsonRaw = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/locales/en/translation/multiple-respondent-check.json'), 'utf-8');
const commonJsonRaw = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/locales/en/translation/common.json'), 'utf-8');
const multipleRespondentJson = JSON.parse(multipleRespondentJsonRaw);
const commonJsonRawJson = JSON.parse(commonJsonRaw);

const PAGE_URL = '/multiple-respondent-check';
const titleClass = 'govuk-heading-xl';
const pClass = 'govuk-body';
const iClass = 'govuk-inset-text';
const expectedTitle = multipleRespondentJson.h1;
const expectedP1 = multipleRespondentJson.p1;
const expectedP2 = multipleRespondentJson.p2;

const buttonClass = 'govuk-button';
const backButtonClass = 'govuk-back-link';
const radioClass = 'govuk-radios__item';
const errorClass = 'govuk-error-message';
const errorSummaryClass = 'govuk-error-summary__list';
const errorSummaryTitleClass = 'govuk-error-summary__title';
const expectedRadioLabel1 = multipleRespondentJson.radio1;
const expectedRadioLabel2 = multipleRespondentJson.radio2;
const expectedButtonText = commonJsonRawJson.continue;
const expectedBackButtonText = commonJsonRawJson.back;
const expectedErrorMessage = multipleRespondentJson.errorMessage;
const errorSummaryTitle = commonJsonRawJson.errorSummaryTitle;

let htmlRes: Document;
describe('Multiple Respondent page', () => {
    beforeAll(async () => {
        await request(app).get(PAGE_URL).then(res => {
            htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        });
    });

    it('should display title', () => {
        const title = htmlRes.getElementsByClassName(titleClass);
        expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
    });

    it('should display firt paragraph', () => {
        const paragraph = htmlRes.getElementsByClassName(pClass);
        expect(paragraph[0].innerHTML).contains(expectedP1, 'P1 does not exist');
    });

    it('should display second paragraph', () => {
        const inset = htmlRes.getElementsByClassName(iClass);
        expect(inset[0].innerHTML).contains(expectedP2, 'P2 does not exist');
    });


    it('should display continue button', () => {
        const button = htmlRes.getElementsByClassName(buttonClass);
        expect(button[0].innerHTML).contains(expectedButtonText, 'Could not find button with text ' + expectedButtonText);
    });

    it('should display back button', () => {
        const backButton = htmlRes.getElementsByClassName(backButtonClass);
        expect(backButton[0].innerHTML).contains(expectedBackButtonText, 'Could not find button with text ' + expectedButtonText);
    });

    it('should display 2 radio buttons', () => {
        const radioButtons = htmlRes.getElementsByClassName(radioClass);
        expect(radioButtons.length).equal(2, '2 radio buttons not found');
    });

    it('should display radio buttons with valid text', () => {
        const radioButtons = htmlRes.getElementsByClassName(radioClass);
        expect(radioButtons[0].innerHTML).contains(expectedRadioLabel1, 'Could not find the radio button with label ' + expectedRadioLabel1);
        expect(radioButtons[1].innerHTML).contains(expectedRadioLabel2, 'Could not find the radio button with label ' + expectedRadioLabel2);
    });
});


describe('Multiple Respondent page with error', () => {
    beforeAll(async () => {
        await request(app).post(PAGE_URL).then(res => {
            htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
        });
    });

    it('should display error message', () => {
        const errorMessage = htmlRes.getElementsByClassName(errorClass);
        expect(errorMessage[0].innerHTML).contains(expectedErrorMessage, 'Could not find an error message');
    });


    it('should display error summary title', () => {
        const errorSummary = htmlRes.getElementsByClassName(errorSummaryTitleClass);
        expect(errorSummary[0].innerHTML).contains(errorSummaryTitle, 'Could not find an error summary title');
    });

    it('should display error summary', () => {
        const errorMessage = htmlRes.getElementsByClassName(errorSummaryClass);
        expect(errorMessage[0].children[0].children[0].innerHTML).contains(expectedErrorMessage, 'Could not find an error message summary');
    });

});

