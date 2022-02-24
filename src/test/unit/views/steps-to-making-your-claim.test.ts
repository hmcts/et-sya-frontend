import fs from 'fs';
import path from 'path';

import { expect } from 'chai';
import request from 'supertest';


import { app } from '../../../main/app';

const stepsToMakingYourClaimJSONRaw = fs.readFileSync(
    path.resolve(__dirname, '../../../main/resources/locales/en/translation/steps-to-making-your-claim.json'),
    'utf-8'
  );
const stepsToMakingYourClaimJSON = JSON.parse(stepsToMakingYourClaimJSONRaw);

const PAGE_URL = '/steps-to-making-your-claim-page';
const rowClass = 'govuk-table__row';
const cellClass = 'govuk-table__cell';
const tableClass = 'govuk-table';
const headerClass = 'govuk-table__header';
const titleClass = 'govuk-heading-xl';
const expectedTitle = stepsToMakingYourClaimJSON.h1 + "TODO";
const expectedHeader1 = stepsToMakingYourClaimJSON.section1.title;
const expectedHeader2 = stepsToMakingYourClaimJSON.section2.title;
const expectedHeader3 = stepsToMakingYourClaimJSON.section3.title;
const expectedHeader4 = stepsToMakingYourClaimJSON.section4.title;

let htmlRes: Document;
describe('Steps to making your claim page',()=>{
    beforeAll(async () => {
        await request(app)
          .get(PAGE_URL)
          .then(res => {
            htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
          });
      });

      it('should display title', () => {
        const title = htmlRes.getElementsByClassName(titleClass);
        expect(title[0].innerHTML).contains(expectedTitle, 'Page title does not exist');
      });

      it('should display correct number of rows', () => {
          const row = htmlRes.getElementsByClassName(rowClass);
          expect(row.length).equal(14,'number of tables found is not 14');
      });

      it('should display the correct number of tables', () => {
          const table = htmlRes.getElementsByClassName(tableClass);
          expect(table.length).equal(4,'number of tables found is not 4');
      });

      it('should display the correct number of cells', () => {
          const cell = htmlRes.getElementsByClassName(cellClass);
          expect(cell.length).equal(20,'number of cells found is not 20');
      });

      it('shoul display the correct number of table headers',() =>{
          const header = htmlRes.getElementsByClassName(headerClass);
          expect(header.length).equal(4,'number of table headers found is not 4');
      });

      it('should display the correct table header texts', () => {
          const header = htmlRes.getElementsByClassName(headerClass);
          expect(header[0].innerHTML).contains(expectedHeader1,'could not find table 1 header text');
          expect(header[1].innerHTML).contains(expectedHeader2,'could not find table 2 header text');
          expect(header[2].innerHTML).contains(expectedHeader3,'could not find table 3 header text');
          expect(header[3].innerHTML).contains(expectedHeader4,'could not find table 4 header text');
      });
     
})
