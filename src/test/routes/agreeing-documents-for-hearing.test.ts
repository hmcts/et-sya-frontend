import request from 'supertest';

import * as helper from '../../main/controllers/helpers/CaseHelpers';
import { AgreedDocuments } from '../../main/definitions/case';
import { PageUrls } from '../../main/definitions/constants';
import { mockApp } from '../unit/mocks/mockApp';

describe(`GET ${PageUrls.AGREEING_DOCUMENTS_FOR_HEARING}`, () => {
  it('should return the agreeing documents for hearing page', async () => {
    const res = await request(mockApp({})).get(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING);
    expect(res.type).toStrictEqual('text/html');
    expect(res.status).toStrictEqual(200);
  });
});

describe(`POST ${PageUrls.AGREEING_DOCUMENTS_FOR_HEARING}`, () => {
  describe('Correct input', () => {
    jest.spyOn(helper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

    test('should navigate to the next page when the Yes radio button is selected', async () => {
      await request(mockApp({}))
        .post(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING)
        .send({ bundlesRespondentAgreedDocWith: AgreedDocuments.YES })
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.ABOUT_HEARING_DOCUMENTS);
        });
    });

    test('should navigate to the next page when the We have agreed... radio button is selected and text is entered in the text area', async () => {
      await request(mockApp({}))
        .post(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING)
        .send({
          bundlesRespondentAgreedDocWith: AgreedDocuments.AGREEDBUT,
          bundlesRespondentAgreedDocWithBut: 'Test agreed text',
        })
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.ABOUT_HEARING_DOCUMENTS);
        });
    });

    test('should navigate to the next page when the No, we have not agreed... radio button is selected and text is entered in the text area', async () => {
      await request(mockApp({}))
        .post(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING)
        .send({
          bundlesRespondentAgreedDocWith: AgreedDocuments.NOTAGREED,
          bundlesRespondentAgreedDocWithNo: 'Test not agreed text',
        })
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.ABOUT_HEARING_DOCUMENTS);
        });
    });

    test('should reload the page when no radio button is selected', async () => {
      await request(mockApp({}))
        .post(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING)
        .send({})
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING);
        });
    });

    test('should reload the page when the We have agreed... radio button is selected and text area is left blank', async () => {
      await request(mockApp({}))
        .post(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING)
        .send({ bundlesRespondentAgreedDocWith: AgreedDocuments.AGREEDBUT, bundlesRespondentAgreedDocWithBut: '' })
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING);
        });
    });

    test('should reload the page when the No, we have not agreed... radio button is selected and text area is left blank', async () => {
      await request(mockApp({}))
        .post(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING)
        .send({ bundlesRespondentAgreedDocWith: AgreedDocuments.NOTAGREED, bundlesRespondentAgreedDocWithNo: '' })
        .expect(res => {
          expect(res.status).toStrictEqual(302);
          expect(res.header['location']).toStrictEqual(PageUrls.AGREEING_DOCUMENTS_FOR_HEARING);
        });
    });
  });
});
