import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.REPRESENTATIVE_DETAILS}`, () => {
  it('should return the representative details page', async () => {
    const res = await request(mockApp({})).get(PageUrls.REPRESENTATIVE_DETAILS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.REPRESENTATIVE_DETAILS}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

  it('should redirect to the representative details page on valid submission', async () => {
    await request(mockApp({}))
      .post(PageUrls.REPRESENTATIVE_DETAILS)
      .send({
        representativeType: 'Solicitor',
        representativeOrgName: 'Smith & Co',
        representativeName: 'Jane Smith',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REPRESENTATIVE_DETAILS);
      });
  });

  it('should redirect back to the page when representative type is missing', async () => {
    await request(mockApp({}))
      .post(PageUrls.REPRESENTATIVE_DETAILS)
      .send({
        representativeType: '',
        representativeOrgName: '',
        representativeName: 'Jane Smith',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REPRESENTATIVE_DETAILS);
      });
  });

  it('should redirect back to the page when representative name is missing', async () => {
    await request(mockApp({}))
      .post(PageUrls.REPRESENTATIVE_DETAILS)
      .send({
        representativeType: 'Solicitor',
        representativeOrgName: '',
        representativeName: '',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REPRESENTATIVE_DETAILS);
      });
  });

  it('should accept submission with no organisation name as it is optional', async () => {
    await request(mockApp({}))
      .post(PageUrls.REPRESENTATIVE_DETAILS)
      .send({
        representativeType: 'Trade Union',
        representativeOrgName: '',
        representativeName: 'Bob Jones',
      })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REPRESENTATIVE_DETAILS);
      });
  });
});
