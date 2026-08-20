import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.HEARING_PANEL_PREFERENCE}`, () => {
  it('should return the hearing panel preference page', async () => {
    const res = await request(mockApp({})).get(PageUrls.HEARING_PANEL_PREFERENCE);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.HEARING_PANEL_PREFERENCE}`, () => {
  jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());
  test('should return reasonable adjustments page when judge and reason are submitted', async () => {
    await request(mockApp({}))
      .post(PageUrls.HEARING_PANEL_PREFERENCE)
      .send({ claimantHearingPanelPreference: 'Judge', claimantHearingPanelPreferenceWhy: 'Legal reason' })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(PageUrls.REASONABLE_ADJUSTMENTS);
      });
  });
});
