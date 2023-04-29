import { Response } from 'express';

import { AppRequest, UserDetails } from '../definitions/appRequest';
import { AddressPageType, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { TypesOfClaim, sectionStatus } from '../definitions/definition';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helper/ApiFormatter';
import { getLogger } from '../logger';
import { getPreloginCaseData } from '../services/CacheService';
import { getCaseApi } from '../services/CaseService';

import { getSectionStatus, getSectionStatusForEmployment, setUserCaseWithRedisData } from './helpers/CaseHelpers';
import { getPageContent } from './helpers/FormHelpers';
import { setUrlLanguage } from './helpers/LanguageHelper';

const logger = getLogger('StepsToMakingYourClaimController');

export default class StepsToMakingYourClaimController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    if (req.session.userCase !== undefined) {
      req.session.userCase.addressPageType = AddressPageType.ADDRESS_DETAILS;
    }
    const redirectUrl = setUrlLanguage(req, PageUrls.CLAIM_SAVED);
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM,
    ]);
    const { userCase } = req.session;
    if (req.app && req.app.locals && req.app.locals.redisClient && req.session.guid) {
      const redisClient = req.app.locals.redisClient;
      const caseData = await getPreloginCaseData(redisClient, req.session.guid);
      if (userCase.id === undefined) {
        const userDetails: UserDetails = {
          id: '1234',
          givenName: 'Bobby',
          familyName: 'Ryan',
          email: 'bobby@gmail.com',
          accessToken: 'xxxx',
          isCitizen: true,
        };
        // todo try-catch this - if createCase errors the whole app fails.
        const newCase = await getCaseApi(req.session.user?.accessToken).createCase(caseData, userDetails);
        logger.info(`Created Draft Case - ${newCase.data.id}`);
        req.session.userCase = fromApiFormat(newCase.data);
      }
      setUserCaseWithRedisData(req, caseData);
    }

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
            url: setUrlLanguage(req, PageUrls.DOB_DETAILS.toString()),
            linkTxt: (l: AnyRecord): string => l.section1.link1Text,
            status: (): string => getSectionStatus(userCase?.personalDetailsCheck, userCase?.dobDate),
          },
          {
            url: setUrlLanguage(req, PageUrls.POSTCODE_ENTER.toString()),
            linkTxt: (l: AnyRecord): string => l.section1.link2Text,
            status: (): string => getSectionStatus(userCase?.personalDetailsCheck, userCase?.address1),
          },
          {
            url: setUrlLanguage(req, PageUrls.UPDATE_PREFERENCES.toString()),
            linkTxt: (l: AnyRecord): string => l.section1.link3Text,
            status: (): string => getSectionStatus(userCase?.personalDetailsCheck, userCase?.claimantContactPreference),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section2.title,
        links: [
          {
            url: setUrlLanguage(req, PageUrls.PAST_EMPLOYER.toString()),
            linkTxt: (l: AnyRecord): string => l.section2.link1Text,
            status: (): string =>
              getSectionStatusForEmployment(
                userCase?.employmentAndRespondentCheck,
                userCase?.pastEmployer,
                req.session.userCase?.typeOfClaim,
                userCase?.isStillWorking
              ),
          },
          {
            url: setUrlLanguage(req, PageUrls.FIRST_RESPONDENT_NAME.toString()),
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
            url: setUrlLanguage(req, PageUrls.DESCRIBE_WHAT_HAPPENED.toString()),
            linkTxt: (l: AnyRecord): string => l.section3.link1Text,
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
            linkTxt: (l: AnyRecord): string => l.section3.link2Text,
            status: (): string => getSectionStatus(userCase?.claimDetailsCheck, userCase?.tellUsWhatYouWant?.length),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section4.title,
        links: [
          {
            url: (): string => (allSectionsCompleted ? setUrlLanguage(req, PageUrls.PCQ.toString()) : ''),
            linkTxt: (l: AnyRecord): string => l.section4.link1Text,
            status: (): string => (allSectionsCompleted ? sectionStatus.notStarted : sectionStatus.cannotStartYet),
          },
        ],
      },
    ];
    if (req.session.userCase?.typeOfClaim?.includes(TypesOfClaim.DISCRIMINATION.toString())) {
      sections[2].links[0].url = setUrlLanguage(req, PageUrls.CLAIM_TYPE_DISCRIMINATION.toString());
    } else if (req.session.userCase?.typeOfClaim?.includes(TypesOfClaim.PAY_RELATED_CLAIM.toString())) {
      sections[2].links[0].url = setUrlLanguage(req, PageUrls.CLAIM_TYPE_PAY.toString());
    }
    if (req.session.userCase?.typeOfClaim?.includes(TypesOfClaim.UNFAIR_DISMISSAL.toString())) {
      req.session.userCase.pastEmployer = YesOrNo.YES;
      sections[1].links[0].url = setUrlLanguage(req, PageUrls.STILL_WORKING.toString());
    }
    res.render(TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM, {
      ...content,
      sections,
      typeOfClaim: userCase?.typeOfClaim,
      redirectUrl,
    });
  }
}
