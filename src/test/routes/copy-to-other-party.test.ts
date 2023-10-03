import request from 'supertest';

import { YesOrNo } from '../../main/definitions/case';
import { PageUrls, languages } from '../../main/definitions/constants';
import { mockApp, mockSession } from '../unit/mocks/mockApp';
import * as LaunchDarkly from '../../main/modules/featureFlag/launchDarkly';

describe(`GET ${PageUrls.COPY_TO_OTHER_PARTY}`, () => {
  const mockLdClient = jest.spyOn(LaunchDarkly, 'getFlagValue');
  mockLdClient.mockResolvedValue(true);
  it('should return the Rule 92 page', async () => {
    const res = await request(mockApp({})).get(PageUrls.COPY_TO_OTHER_PARTY);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`on POST ${PageUrls.COPY_TO_OTHER_PARTY}`, () => {
  test('should navigate to the contact the tribunal cya page in English when current page is in English and save and continue button is clicked', async () => {
    await request(
      mockApp({
        session: mockSession([], [], []),
      })
    )
      .post(PageUrls.COPY_TO_OTHER_PARTY + languages.ENGLISH_URL_PARAMETER)
      .send({ copyToOtherPartyYesOrNo: YesOrNo.YES })
      .expect(res => {
        expect(res.status).toStrictEqual(302);
        expect(res.header['location']).toStrictEqual(
          PageUrls.RESPONDENT_APPLICATION_CYA + languages.ENGLISH_URL_PARAMETER
        );
      });
  });
});
