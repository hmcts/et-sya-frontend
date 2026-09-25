import ClaimantRepEditEmailController from '../../../main/controllers/ClaimantRepEditEmailController';
import * as ClaimantRepAboutYouHelper from '../../../main/controllers/helpers/ClaimantRepAboutYouHelper';
import { CaseWithId } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys, languages } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

const SAFE_CASE_ID = '1786637776090539';

describe('ClaimantRepEditEmailController', () => {
  let controller: ClaimantRepEditEmailController;

  beforeEach(() => {
    controller = new ClaimantRepEditEmailController();
    jest.restoreAllMocks();
  });

  describe('get()', () => {
    it('redirects to claimant applications when case id is not a 16-digit CCD id', async () => {
      const req = mockRequest({});
      const res = mockResponse();
      req.params = { caseId: 'case-123' };

      await controller.get(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    });

    it('renders the edit email page with a safe about-you back link', async () => {
      jest.spyOn(ClaimantRepAboutYouHelper, 'loadClaimantRepCase').mockResolvedValue(true);
      const req = mockRequest({
        session: {
          user: { email: 'WSmith@TPF.com' },
          userCase: { id: SAFE_CASE_ID, claimantRepEmail: 'WSmith@TPF.com' } as CaseWithId,
        },
      });
      const res = mockResponse();
      req.params = { caseId: SAFE_CASE_ID };
      req.url = `/claimant-rep-edit-email/${SAFE_CASE_ID}${languages.ENGLISH_URL_PARAMETER}`;

      await controller.get(req, res);

      expect(res.render).toHaveBeenCalledWith(
        TranslationKeys.CLAIMANT_REP_EDIT_EMAIL,
        expect.objectContaining({
          backLinkUrl: `${PageUrls.CLAIMANT_REP_ABOUT_YOU_BASE}${SAFE_CASE_ID}${languages.ENGLISH_URL_PARAMETER}`,
        })
      );
    });
  });

  describe('post()', () => {
    it('redirects to claimant applications when the about-you case is not loaded', async () => {
      jest.spyOn(ClaimantRepAboutYouHelper, 'ensureClaimantRepCaseLoaded').mockResolvedValue(false);
      const req = mockRequest({ body: { claimantRepEmail: 'WSmith@TPF.com' } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(res.redirect).toHaveBeenCalledWith(PageUrls.CLAIMANT_APPLICATIONS);
    });

    it('delegates to handleRepAboutYouFieldPost when the case is loaded', async () => {
      jest.spyOn(ClaimantRepAboutYouHelper, 'ensureClaimantRepCaseLoaded').mockResolvedValue(true);
      const fieldPost = jest
        .spyOn(ClaimantRepAboutYouHelper, 'handleRepAboutYouFieldPost')
        .mockResolvedValue(undefined);
      const req = mockRequest({ body: { claimantRepEmail: 'WSmith@TPF.com' } });
      const res = mockResponse();

      await controller.post(req, res);

      expect(fieldPost).toHaveBeenCalled();
    });
  });
});
