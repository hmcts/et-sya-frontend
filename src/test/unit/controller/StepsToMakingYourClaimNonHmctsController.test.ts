import StepsToMakingYourClaimNonHmctsController from '../../../main/controllers/StepsToMakingYourClaimNonHmctsController';
import * as CaseHelper from '../../../main/controllers/helpers/CaseHelpers';
import { EmailOrPost, YesOrNo } from '../../../main/definitions/case';
import { PageUrls, TranslationKeys } from '../../../main/definitions/constants';
import { TellUsWhatYouWant, TypesOfClaim } from '../../../main/definitions/definition';
import { AnyRecord } from '../../../main/definitions/util-types';
import { mockRequest } from '../mocks/mockRequest';
import { mockResponse } from '../mocks/mockResponse';

jest.spyOn(CaseHelper, 'handleUpdateDraftCase').mockImplementation(() => Promise.resolve());

describe('StepsToMakingYourClaimNonHmctsController', () => {
  const t = {
    'steps-to-making-your-claim-non-hmcts': {},
    common: {},
  };

  describe('get()', () => {
    it('should render the steps to making your claim non-hmcts page', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM_NON_HMCTS,
        expect.anything()
      );
    });

    it('should include sections in the render context', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM_NON_HMCTS,
        expect.objectContaining({
          sections: expect.any(Array),
        })
      );
    });

    it('should render 5 sections', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.sections).toHaveLength(5);
    });

    it('should include redirectUrl in render context', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      expect(response.render).toHaveBeenCalledWith(
        TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM_NON_HMCTS,
        expect.objectContaining({
          redirectUrl: expect.any(String),
        })
      );
    });

    it('should include deleteDraftUrl using caseReference from session userCase id', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.deleteDraftUrl).toContain('1234');
      expect(renderArgs.deleteDraftUrl).toContain('redirect=claim-steps');
    });

    it('should include deleteDraftUrl using param id when provided and not undefined', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({ t });
      request.params = { id: '5678' };

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.deleteDraftUrl).toContain('5678');
    });

    it('should fall back to session userCase id when param id is "undefined"', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({ t });
      request.params = { id: 'undefined' };

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      expect(renderArgs.deleteDraftUrl).toContain('1234');
    });

    it('should set STILL_WORKING link when UNFAIR_DISMISSAL type of claim is selected', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { typeOfClaim: [TypesOfClaim.UNFAIR_DISMISSAL.toString()] },
      });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      const employmentSection = renderArgs.sections[2];
      expect(employmentSection.links[0].url).toContain(PageUrls.IS_CLAIMANT_STILL_WORKING);
    });

    it('should set pastEmployer to YES when UNFAIR_DISMISSAL type of claim is selected', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { typeOfClaim: [TypesOfClaim.UNFAIR_DISMISSAL.toString()] },
      });

      controller.get(request, response);

      expect(request.session.userCase.pastEmployer).toEqual(YesOrNo.YES);
    });

    it('should use PAST_EMPLOYER link when UNFAIR_DISMISSAL is not in type of claim', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { typeOfClaim: [TypesOfClaim.PAY_RELATED_CLAIM.toString()] },
      });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      const employmentSection = renderArgs.sections[2];
      expect(employmentSection.links[0].url).toContain(PageUrls.DID_CLAIMANT_WORK_FOR_EMPLOYER);
    });

    it('should set section 5 link to PCQ when all sections are completed', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: {
          representativeDetailsCheck: YesOrNo.YES,
          representedClaimantDetailsCheck: YesOrNo.YES,
          employmentAndRespondentCheck: YesOrNo.YES,
          claimDetailsCheck: YesOrNo.YES,
        },
      });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      const checkAnswersSection = renderArgs.sections[4];
      expect(checkAnswersSection.links[0].url()).toContain(PageUrls.PCQ);
    });

    it('should set section 5 link to empty string when not all sections are completed', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      const checkAnswersSection = renderArgs.sections[4];
      expect(checkAnswersSection.links[0].url()).toEqual('');
    });

    it('should include section 1 with representative details and comms preference links', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      const section1 = renderArgs.sections[0];
      expect(section1.links[0].url).toContain(PageUrls.REPRESENTATIVE_DETAILS);
      expect(section1.links[1].url).toContain(PageUrls.REPRESENTATIVE_COMMS_PREFERENCE);
    });

    it('should include section 2 with represented claimant name link', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      const section2 = renderArgs.sections[1];
      expect(section2.links[0].url).toContain(PageUrls.REPRESENTED_CLAIMANT_NAME);
    });

    it('should include section 4 with type of claim and tell us what you want links', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({ t });

      controller.get(request, response);

      const renderArgs = (response.render as jest.Mock).mock.calls[0][1];
      const section4 = renderArgs.sections[3];
      expect(section4.links[0].url).toContain(PageUrls.CLAIMANT_TYPE_OF_CLAIM);
      expect(section4.links[1].url).toContain(PageUrls.TELL_US_WHAT_YOU_WANT);
    });

    it('should invoke title and linkTxt lambdas for all sections', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({ t });
      controller.get(request, response);
      const { sections } = (response.render as jest.Mock).mock.calls[0][1];
      const l = {
        section1: { title: 'S1', link1Text: 'L1', link2Text: 'L2' },
        section2: { title: 'S2', link1Text: 'L3' },
        section3: { title: 'S3', link1Text: 'L4', link2Text: 'L5' },
        section4: { title: 'S4', link1Text: 'L6', link2Text: 'L7' },
        section5: { title: 'S5', link1Text: 'L8' },
      };
      type SectionLink = { linkTxt: (l: AnyRecord) => string };
      type Section = { title: (l: AnyRecord) => string; links: SectionLink[] };
      (sections as Section[]).forEach(section => {
        expect(section.title(l)).toBeTruthy();
        section.links.forEach(link => expect(link.linkTxt(l)).toBeTruthy());
      });
    });

    it('should invoke status lambdas for all section links', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: {
          representativeName: 'Jane',
          claimantContactPreference: EmailOrPost.EMAIL,
          dobDate: { year: '1990', month: '01', day: '01' },
          respondents: [{ respondentName: 'Acme' }],
          claimSummaryText: 'summary',
          tellUsWhatYouWant: [TellUsWhatYouWant.COMPENSATION_ONLY],
        },
      });
      controller.get(request, response);
      const { sections } = (response.render as jest.Mock).mock.calls[0][1];
      type StatusLink = { status: () => string };
      type StatusSection = { links: StatusLink[] };
      (sections as StatusSection[]).forEach(section =>
        section.links.forEach(link => expect(link.status()).toBeDefined())
      );
    });

    it('should invoke section 3 respondents length status lambda', () => {
      const controller = new StepsToMakingYourClaimNonHmctsController();
      const response = mockResponse();
      const request = mockRequest({
        t,
        userCase: { respondents: [{ respondentName: 'Acme' }, { respondentName: 'Beta' }] },
      });
      controller.get(request, response);
      const { sections } = (response.render as jest.Mock).mock.calls[0][1];
      expect(sections[2].links[1].status()).toBeDefined();
    });
  });
});
