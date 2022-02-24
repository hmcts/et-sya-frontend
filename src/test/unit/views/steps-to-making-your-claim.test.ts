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
const tableClass = 'govuk-table';

const titleClass = 'govuk-heading-xl';
const expectedTitle = stepsToMakingYourClaimJSON.h1 + "TODO";

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
   
     
})
