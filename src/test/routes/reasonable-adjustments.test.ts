import request from 'supertest';

import { CaseTypeId } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { CuiYourSupportFeature } from '../../main/modules/featureFlag/CuiYourSupportFeature';
import * as CuiYourSupportFeatureModule from '../../main/modules/featureFlag/CuiYourSupportFeature';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.REASONABLE_ADJUSTMENTS}`, () => {
  it('should return the old reasonable adjustments page by default', async () => {
    const res = await request(mockApp({})).get(PageUrls.REASONABLE_ADJUSTMENTS);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });

  it('should redirect to your support when CUI your support is enabled for the case type', async () => {
    const featureMock = jest
      .spyOn(CuiYourSupportFeatureModule, 'getCuiYourSupportFeature')
      .mockReturnValue(new CuiYourSupportFeature([CaseTypeId.SCOTLAND]));
    try {
      const res = await request(mockApp({ userCase: { caseTypeId: CaseTypeId.SCOTLAND } })).get(
        PageUrls.REASONABLE_ADJUSTMENTS
      );
      expect(res.status).toStrictEqual(302);
      expect(res.header['location']).toStrictEqual(PageUrls.YOUR_SUPPORT);
    } finally {
      featureMock.mockRestore();
    }
  });
});
