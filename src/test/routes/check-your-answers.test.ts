import request from 'supertest';

import { CaseType, NoAcasNumberReason, YesOrNo } from '../../main/definitions/case';
import { mockApp } from '../unit/mocks/mockApp';

const PAGE_URL = '/check-your-answers';

describe(`GET ${PAGE_URL}`, () => {
  it('should return the check your answers page', async () => {
    const res = await request(
      mockApp({
        userCase: {
          typeOfClaim: ['discrimination'],
          address1: '10 Test Street',
          addressTown: 'Test Town',
          addressCountry: 'United Kingdom',
          addressPostcode: 'AB1 2CD',
          caseType: CaseType.SINGLE,
          claimSummaryText: 'This is what happened.',
          respondents: [
            {
              respondentNumber: 1,
              respondentName: 'John Doe',
              respondentAddress1: '102 Petty France, London',
              respondentAddressTown: 'London',
              respondentAddressCountry: 'United Kingdom',
              acasCert: YesOrNo.NO,
              acasCertNum: '12345',
              noAcasReason: NoAcasNumberReason.ANOTHER,
            },
          ],
        },
      })
    ).get(PAGE_URL);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});
