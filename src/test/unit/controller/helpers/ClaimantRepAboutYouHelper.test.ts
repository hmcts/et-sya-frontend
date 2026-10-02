import { Form } from '../../../../main/components/form/form';
import * as CaseHelpers from '../../../../main/controllers/helpers/CaseHelpers';
import {
  getClaimantRepAboutYouPageUrl,
  getRepAboutYouReturnUrl,
  handleRepAboutYouFieldPost,
  handleRepAboutYouPostLogic,
} from '../../../../main/controllers/helpers/ClaimantRepAboutYouHelper';
import { PageUrls, languages } from '../../../../main/definitions/constants';
import { getLogger } from '../../../../main/logger';
import { mockRequest } from '../../mocks/mockRequest';
import { mockResponse } from '../../mocks/mockResponse';

const SAFE_CASE_ID = '1786637776090539';
const logger = getLogger('ClaimantRepAboutYouHelper.test');

const minimalForm = new Form({
  representativeName: {
    id: 'representativeName',
    name: 'representativeName',
    type: 'text',
  },
} as never);

describe('ClaimantRepAboutYouHelper redirect helpers', () => {
  beforeEach(() => {
    jest.spyOn(CaseHelpers, 'handleUpdateClaimantRepAboutYou').mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getClaimantRepAboutYouPageUrl', () => {
    it('builds a Fortify-safe about-you URL for a 16-digit case id', () => {
      const req = mockRequest({});
      req.url = `/claimant-rep-edit-email/${SAFE_CASE_ID}${languages.ENGLISH_URL_PARAMETER}`;

      expect(getClaimantRepAboutYouPageUrl(SAFE_CASE_ID, req)).toBe(
        `${PageUrls.CLAIMANT_REP_ABOUT_YOU_BASE}${SAFE_CASE_ID}${languages.ENGLISH_URL_PARAMETER}`
      );
    });

    it('falls back to claimant applications when case id is not a 16-digit CCD id', () => {
      const req = mockRequest({});
      expect(getClaimantRepAboutYouPageUrl('case-123', req)).toBe(PageUrls.CLAIMANT_APPLICATIONS);
      expect(getClaimantRepAboutYouPageUrl('1234', req)).toBe(PageUrls.CLAIMANT_APPLICATIONS);
    });
  });

  describe('getRepAboutYouReturnUrl', () => {
    it('uses validated session case id when building the return URL', () => {
      const req = mockRequest({ session: { repAboutYouCaseId: SAFE_CASE_ID } });
      req.url = `/representative-address-details${languages.WELSH_URL_PARAMETER}`;

      expect(getRepAboutYouReturnUrl(req)).toBe(
        `${PageUrls.CLAIMANT_REP_ABOUT_YOU_BASE}${SAFE_CASE_ID}${languages.WELSH_URL_PARAMETER}`
      );
    });

    it('falls back to claimant applications when session case id is unsafe', () => {
      const req = mockRequest({ session: { repAboutYouCaseId: 'not-a-case-id' } });
      expect(getRepAboutYouReturnUrl(req)).toBe(PageUrls.CLAIMANT_APPLICATIONS);
    });
  });

  describe('handleRepAboutYouFieldPost', () => {
    it('redirects to a safe about-you URL after a successful field save', async () => {
      const req = mockRequest({
        body: { representativeName: 'Wolfie Smith' },
        session: {
          repAboutYouCaseId: SAFE_CASE_ID,
          userCase: { id: SAFE_CASE_ID, representativeName: 'Wolfie Smith' },
        },
      });
      const res = mockResponse();

      await handleRepAboutYouFieldPost(req, res, minimalForm, logger);

      expect(CaseHelpers.handleUpdateClaimantRepAboutYou).toHaveBeenCalled();
      expect(req.session.repAboutYouCaseId).toBe(SAFE_CASE_ID);
      expect(res.redirect).toHaveBeenCalledWith(
        `${PageUrls.CLAIMANT_REP_ABOUT_YOU_BASE}${SAFE_CASE_ID}${languages.ENGLISH_URL_PARAMETER}`
      );
    });

    it('redirects to claimant applications when case id cannot be validated', async () => {
      const req = mockRequest({
        body: { representativeName: 'Wolfie Smith' },
        session: {
          repAboutYouCaseId: 'abc',
          userCase: { id: 'abc', representativeName: 'Wolfie Smith' },
        },
      });
      const res = mockResponse();

      await handleRepAboutYouFieldPost(req, res, minimalForm, logger);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    });

    it('still redirects to a safe about-you URL when draft update reports an error', async () => {
      jest.spyOn(CaseHelpers, 'handleUpdateClaimantRepAboutYou').mockImplementation(async req => {
        req.session.userCase.updateDraftCaseError = 'update failed';
      });
      const req = mockRequest({
        body: { representativeName: 'Wolfie Smith' },
        session: {
          repAboutYouCaseId: SAFE_CASE_ID,
          userCase: { id: SAFE_CASE_ID, representativeName: 'Wolfie Smith' },
        },
      });
      const res = mockResponse();

      await handleRepAboutYouFieldPost(req, res, minimalForm, logger);

      expect(res.redirect).toHaveBeenCalledWith(
        `${PageUrls.CLAIMANT_REP_ABOUT_YOU_BASE}${SAFE_CASE_ID}${languages.ENGLISH_URL_PARAMETER}`
      );
    });
  });

  describe('handleRepAboutYouPostLogic', () => {
    it('appends a constant language param to a constant page redirect', async () => {
      const req = mockRequest({
        body: { representativeEnterPostcode: 'SW1A 1AA' },
        session: {
          repAboutYouCaseId: SAFE_CASE_ID,
          userCase: { id: SAFE_CASE_ID },
        },
      });
      req.url = `/representative-postcode-enter${languages.ENGLISH_URL_PARAMETER}`;
      const res = mockResponse();
      const form = new Form({
        representativeEnterPostcode: {
          id: 'representativeEnterPostcode',
          name: 'representativeEnterPostcode',
          type: 'text',
        },
      } as never);

      await handleRepAboutYouPostLogic(req, res, form, logger, PageUrls.REPRESENTATIVE_POSTCODE_SELECT);

      expect(res.redirect).toHaveBeenCalledWith(
        `${PageUrls.REPRESENTATIVE_POSTCODE_SELECT}${languages.ENGLISH_URL_PARAMETER}`
      );
    });

    it('redirects to claimant applications when the about-you case cannot be loaded', async () => {
      const req = mockRequest({ body: {}, session: { userCase: {} } });
      const res = mockResponse();

      await handleRepAboutYouPostLogic(req, res, minimalForm, logger, PageUrls.REPRESENTATIVE_POSTCODE_SELECT);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    });
  });
});
