import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { YesOrNo } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

const pageUrl = '/respondent/1/work-address';

describe(`GET ${PageUrls.WORK_ADDRESS}`, () => {
  it('should return the did you work at respondent address page', async () => {
    const res = await request(
      mockApp({
        userCase: {
          respondents: [
            {
              respondentNumber: 1,
              respondentName: 'Name',
            },
          ],
        },
      })
    ).get(pageUrl);
    expect(res.type).toEqual('text/html');
    expect(res.status).toEqual(200);
  });
});

describe(`on POST ${PageUrls.WORK_ADDRESS}`, () => {
  test('should load acas number page if yes is selected', async () => {
    jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
    await request(
      mockApp({
        userCase: {
          respondents: [
            {
              respondentNumber: 1,
              respondentName: 'Name',
            },
          ],
        },
      })
    )
      .post(pageUrl)
      .send({ claimantWorkAddressQuestion: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual('/respondent/1/acas-cert-num');
      });
  });

  test('should load place of work page if no is selected', async () => {
    jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementationOnce(() => Promise.resolve());
    await request(
      mockApp({
        userCase: {
          respondents: [
            {
              respondentNumber: 1,
              respondentName: 'Name',
            },
          ],
        },
      })
    )
      .post(pageUrl)
      .send({ claimantWorkAddressQuestion: YesOrNo.NO })
      .expect(res => {
        expect(res.status).toEqual(302);
        expect(res.header['location']).toEqual('/respondent/1/place-of-work');
      });
  });
});
