import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { TypesOfClaim, sectionStatus } from '../definitions/definition';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { getPreloginCaseData } from '../services/CacheService';

import { getPageContent, getSectionStatus, setUserCaseWithRedisData } from './helpers';

export default class StepsToMakingYourClaimController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM,
    ]);
    if (req.app && req.app.locals && req.app.locals.redisClient && req.session.guid) {
      const redisClient = req.app.locals.redisClient;
      const caseData = await getPreloginCaseData(redisClient, req.session.guid);
      setUserCaseWithRedisData(req, caseData);
    }
    const { userCase } = req.session;
    const allSectionsCompleted = !!(
      userCase?.personalDetailsCheck === YesOrNo.YES &&
      userCase?.employmentAndRespondentCheck === YesOrNo.YES &&
      userCase?.claimDetailsCheck === YesOrNo.YES
    );

    const sections = [
      {
        title: (l: AnyRecord): string => l.section1.title,
        links: [
          {
            url: PageUrls.DOB_DETAILS,
            linkTxt: (l: AnyRecord): string => l.section1.link1Text,
            status: (): string => getSectionStatus(userCase?.personalDetailsCheck, userCase?.dobDate),
          },
          {
            url: PageUrls.ADDRESS_DETAILS,
            linkTxt: (l: AnyRecord): string => l.section1.link2Text,
            status: (): string => getSectionStatus(userCase?.personalDetailsCheck, userCase?.address1),
          },
          {
            url: PageUrls.UPDATE_PREFERENCES,
            linkTxt: (l: AnyRecord): string => l.section1.link3Text,
            status: (): string => getSectionStatus(userCase?.personalDetailsCheck, userCase?.updatePreference),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section2.title,
        links: [
          {
            url: PageUrls.PAST_EMPLOYER,
            linkTxt: (l: AnyRecord): string => l.section2.link1Text,
            status: (): string =>
              getSectionStatus(
                userCase?.employmentAndRespondentCheck,
                userCase?.pastEmployer || userCase?.isStillWorking
              ),
          },
          {
            url: PageUrls.FIRST_RESPONDENT_NAME.toString(),
            linkTxt: (l: AnyRecord): string => l.section2.link2Text,
            status: (): string =>
              getSectionStatus(userCase?.employmentAndRespondentCheck, userCase?.respondents?.length),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section3.title,
        links: [
          {
            url: PageUrls.DESCRIBE_WHAT_HAPPENED.toString(),
            linkTxt: (l: AnyRecord): string => l.section3.link1Text,
            status: (): string =>
              getSectionStatus(
                userCase?.claimDetailsCheck,
                userCase?.claimSummaryFile ||
                  userCase?.claimSummaryText ||
                  userCase?.claimTypeDiscrimination?.length ||
                  userCase?.claimTypePay?.length
              ),
          },
          {
            url: PageUrls.TELL_US_WHAT_YOU_WANT.toString(),
            linkTxt: (l: AnyRecord): string => l.section3.link2Text,
            status: (): string => getSectionStatus(userCase?.claimDetailsCheck, userCase?.tellUsWhatYouWant?.length),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section4.title,
        links: [
          {
            url: (): string => (allSectionsCompleted ? PageUrls.CHECK_ANSWERS.toString() : ''),
            linkTxt: (l: AnyRecord): string => l.section4.link1Text,
            status: (): string => (allSectionsCompleted ? sectionStatus.notStarted : sectionStatus.cannotStartYet),
          },
        ],
      },
    ];
    sections[2].links[0].url = PageUrls.DESCRIBE_WHAT_HAPPENED.toString();
    sections[1].links[0].url = PageUrls.PAST_EMPLOYER.toString();
    if (req.session.userCase?.typeOfClaim?.includes(TypesOfClaim.DISCRIMINATION.toString())) {
      sections[2].links[0].url = PageUrls.CLAIM_TYPE_DISCRIMINATION.toString();
    } else if (req.session.userCase?.typeOfClaim?.includes(TypesOfClaim.PAY_RELATED_CLAIM.toString())) {
      sections[2].links[0].url = PageUrls.CLAIM_TYPE_PAY;
    }
    if (req.session.userCase?.typeOfClaim?.includes(TypesOfClaim.UNFAIR_DISMISSAL.toString())) {
      sections[1].links[0].url = PageUrls.STILL_WORKING;
    }
    res.render(TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM, {
      ...content,
      sections,
      typeOfClaim: userCase?.typeOfClaim,
    });
  }
}
