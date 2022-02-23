import { expect } from 'chai';
import request from 'supertest';


import { app } from '../../../main/app';

const PAGE_URL = '/steps-to-making-your-claim-page';

let htmlRes: Document;
describe('Steps to making your claim page',()=>{
    beforeAll(async () => {
        await request(app)
          .get(PAGE_URL)
          .then(res => {
            htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
          });
      });
})
