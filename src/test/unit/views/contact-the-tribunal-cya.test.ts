import { expect } from 'chai';
import request from 'supertest';

import { PageUrls } from '../../../main/definitions/constants';
import { mockApp } from '../mocks/mockApp';

describe('Contact the tribunal check your answers page', () => {
  let htmlRes: Document;

  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          contactApplicationType: 'witness',
        },
      })
    )
      .get(PageUrls.CONTACT_THE_TRIBUNAL_CYA)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should give the find legal advice link discernible text', () => {
    const legalAdviceLink = htmlRes.querySelector('a[href="https://www.gov.uk/find-legal-advice"]');
    expect(legalAdviceLink, 'Find legal advice link does not exist').to.not.equal(null);
    expect(legalAdviceLink.textContent.trim()).to.equal('Find legal advice (opens in new tab)');
  });
});
