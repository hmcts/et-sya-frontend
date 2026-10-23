import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { CaseTypeId } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { CuiYourSupportFeature } from '../../main/modules/featureFlag/CuiYourSupportFeature';
import * as CuiYourSupportFeatureModule from '../../main/modules/featureFlag/CuiYourSupportFeature';
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

  test('should return your support when CUI your support is enabled', async () => {
    const featureMock = jest
      .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
      .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
    try {
      await request(mockApp({ userCase: { caseTypeId: CaseTypeId.SCOTLAND } }))
        .post(PageUrls.HEARING_PANEL_PREFERENCE)
        .send({ claimantHearingPanelPreference: 'No preference' })
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.YOUR_SUPPORT);
        });
    } finally {
      featureMock.mockRestore();
    }
  });
});
