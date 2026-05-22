import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { TypesOfClaim, sectionStatus } from '../definitions/definition';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getSectionStatus, getSectionStatusForEmployment } from './helpers/CaseHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';
import { getLanguageParam } from './helpers/RouterHelpers';

export default class StepsToMakingYourClaimNonHmctsController {
  public get(req: AppRequest, res: Response): void {
    const redirectUrl = setUrlLanguage(req, PageUrls.CLAIM_SAVED);
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM_NON_HMCTS,
    ]);
    const { userCase } = req.session;

    const allSectionsCompleted = !!(
      userCase?.representativeDetailsCheck === YesOrNo.YES &&
      userCase?.personalDetailsCheck === YesOrNo.YES &&
      userCase?.employmentAndRespondentCheck === YesOrNo.YES &&
      userCase?.claimDetailsCheck === YesOrNo.YES
    );

    const sections = [
      {
        title: (l: AnyRecord): string => l.section1.title,
        links: [
          {
            url: setUrlLanguage(req, PageUrls.REPRESENTATIVE_DETAILS.toString()),
            linkTxt: (l: AnyRecord): string => l.section1.link1Text,
            status: (): string => getSectionStatus(userCase?.representativeDetailsCheck, userCase?.representativeName),
          },
          {
            url: setUrlLanguage(req, PageUrls.REPRESENTATIVE_COMMS_PREFERENCE.toString()),
            linkTxt: (l: AnyRecord): string => l.section1.link2Text,
            status: (): string =>
              getSectionStatus(userCase?.representativeDetailsCheck, userCase?.claimantContactPreference),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section2.title,
        links: [
          {
            url: setUrlLanguage(req, PageUrls.DOB_DETAILS.toString()),
            linkTxt: (l: AnyRecord): string => l.section2.link1Text,
            status: (): string => getSectionStatus(userCase?.personalDetailsCheck, userCase?.dobDate),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section3.title,
        links: [
          {
            url: setUrlLanguage(req, PageUrls.DID_CLAIMANT_WORK_FOR_EMPLOYER.toString()),
            linkTxt: (l: AnyRecord): string => l.section3.link1Text,
            status: (): string =>
              getSectionStatusForEmployment(
                userCase?.employmentAndRespondentCheck,
                userCase?.pastEmployer,
                req.session.userCase?.typeOfClaim,
                userCase?.isStillWorking
              ),
          },
          {
            url: setUrlLanguage(req, PageUrls.CLAIMANT_RESPONDENT_NAME.toString()),
            linkTxt: (l: AnyRecord): string => l.section3.link2Text,
            status: (): string =>
              getSectionStatus(userCase?.employmentAndRespondentCheck, userCase?.respondents?.length),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section4.title,
        links: [
          {
            url: setUrlLanguage(req, PageUrls.CLAIMANT_TYPE_OF_CLAIM.toString()),
            linkTxt: (l: AnyRecord): string => l.section4.link1Text,
            status: (): string =>
              getSectionStatus(
                userCase?.claimDetailsCheck,
                userCase?.claimSummaryText ||
                  userCase?.claimTypeDiscrimination?.length ||
                  userCase?.claimTypePay?.length
              ),
          },
          {
            url: setUrlLanguage(req, PageUrls.TELL_US_WHAT_YOU_WANT.toString()),
            linkTxt: (l: AnyRecord): string => l.section4.link2Text,
            status: (): string => getSectionStatus(userCase?.claimDetailsCheck, userCase?.tellUsWhatYouWant?.length),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section5.title,
        links: [
          {
            url: (): string => (allSectionsCompleted ? setUrlLanguage(req, PageUrls.PCQ.toString()) : ''),
            linkTxt: (l: AnyRecord): string => l.section5.link1Text,
            status: (): string => (allSectionsCompleted ? sectionStatus.notStarted : sectionStatus.cannotStartYet),
          },
        ],
      },
    ];

    if (req.session.userCase?.typeOfClaim?.includes(TypesOfClaim.UNFAIR_DISMISSAL.toString())) {
      req.session.userCase.pastEmployer = YesOrNo.YES;
      sections[2].links[0].url = setUrlLanguage(req, PageUrls.IS_CLAIMANT_STILL_WORKING.toString());
    }

    const paramId = req.params.id;
    const caseReference = paramId && paramId !== 'undefined' ? paramId : req.session.userCase?.id;
    const languageParam = getLanguageParam(req.url);

    res.render(TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM_NON_HMCTS, {
      ...content,
      sections,
      typeOfClaim: userCase?.typeOfClaim,
      deleteDraftUrl: `/claimant-application/${caseReference}/delete${languageParam}${
        languageParam ? '&' : '?'
      }redirect=claim-steps`,
      redirectUrl,
    });
  }
}
