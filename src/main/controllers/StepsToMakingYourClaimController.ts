import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CaseDate, Respondent, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { ClaimOutcomes, TypesOfClaim } from '../definitions/definition';
import { FormContent } from '../definitions/form';
import { AnyRecord } from '../definitions/util-types';

import { getPageContent } from './helpers';
let employeeStatus: string;

export const enum sectionStatus {
  notStarted = 'NOT STARTED',
  completed = 'COMPLETED',
  inProgress = 'IN PROGRESS',
  cannotStartYet = 'CANNOT START YET',
}

const getSectionStatus = (
  detailsCheckValue: YesOrNo,
  sessionValue: string | CaseDate | Respondent[] | ClaimOutcomes[]
) => {
  if (detailsCheckValue === YesOrNo.YES) {
    return sectionStatus.completed;
  } else if (detailsCheckValue === YesOrNo.NO) {
    return sectionStatus.inProgress;
  } else if (sessionValue) {
    return sectionStatus.inProgress;
  } else {
    return sectionStatus.notStarted;
  }
};

export default class StepsToMakingYourClaimController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    const content = getPageContent(req, <FormContent>{}, [
      TranslationKeys.COMMON,
      TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM,
    ]);
    const { userCase } = req.session;
    const sections = [
      {
        title: (l: AnyRecord): string => l.section1.title,
        links: [
          {
            url: PageUrls.DOB_DETAILS,
            linkTxt: (l: AnyRecord): string => l.section1.link1Text,
            status: (): string => getSectionStatus(userCase.personalDetailsCheck, userCase.dobDate),
          },
          {
            url: PageUrls.ADDRESS_DETAILS,
            linkTxt: (l: AnyRecord): string => l.section1.link2Text,
            status: (): string => getSectionStatus(userCase.personalDetailsCheck, userCase.address1),
          },
          {
            url: PageUrls.UPDATE_PREFERENCES,
            linkTxt: (l: AnyRecord): string => l.section1.link3Text,
            status: (): string => getSectionStatus(userCase.personalDetailsCheck, userCase.updatePreference),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section2.title,
        links: [
          {
            url: employeeStatus,
            linkTxt: (l: AnyRecord): string => l.section2.link1Text,
            status: (): string => getSectionStatus(userCase.employmentAndRespondentCheck, userCase.isStillWorking),
          },
          {
            url: PageUrls.RESPONDENT_NAME,
            linkTxt: (l: AnyRecord): string => l.section2.link2Text,
            status: (): string => getSectionStatus(userCase.employmentAndRespondentCheck, userCase.respondents),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section3.title,
        links: [
          {
            url: PageUrls.SUMMARISE_YOUR_CLAIM,
            linkTxt: (l: AnyRecord): string => l.section3.link1Text,
            status: (): string => getSectionStatus(userCase.employmentAndRespondentCheck, userCase.claimSummaryText),
          },

          {
            url: PageUrls.DESIRED_CLAIM_OUTCOME,
            linkTxt: (l: AnyRecord): string => l.section3.link2Text,
            status: (): string => getSectionStatus(userCase.employmentAndRespondentCheck, userCase.claimOutcome),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section4.title,
        links: [
          {
            url: PageUrls.CHECK_ANSWERS,
            linkTxt: (l: AnyRecord): string => l.section4.link1Text,
            status: sectionStatus.cannotStartYet,
          },
        ],
      },
    ];
    sections[1].links[0].url = conditionalWorkingType(req);
    res.render(TranslationKeys.STEPS_TO_MAKING_YOUR_CLAIM, {
      ...content,
      sections,
    });
  }
}

const conditionalWorkingType = (req: AppRequest) => {
  if (req.session.userCase?.typeOfClaim.includes(TypesOfClaim.UNFAIR_DISMISSAL)) {
    employeeStatus = PageUrls.STILL_WORKING;
  } else {
    employeeStatus = PageUrls.PAST_EMPLOYER;
  }
  return employeeStatus;
};
