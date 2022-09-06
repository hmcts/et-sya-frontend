import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CaseApiErrors, PageUrls, TranslationKeys } from '../definitions/constants';
import { HubLinks, hubLinksMap, sectionIndexToLinkNames } from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helper/ApiFormatter';
import { currentStateFn } from '../helper/state-sequence';
import { getCaseApi } from '../services/CaseService';

export default class CitizenHubController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    try {
      req.session.userCase = fromApiFormat(
        (await getCaseApi(req.session.user?.accessToken).getCase(req.params.caseId)).data
      );
    } catch (err) {
      const error = new Error(err);
      error.name = CaseApiErrors.FAILED_TO_RETRIEVE_CASE;
      throw error;
      //todo lead to main page. Check 2086. Try and return not-found.njk possibly.
    }

    const userCase = req.session.userCase;

    userCase.hubLinks = userCase.hubLinks || new HubLinks();

    const currentState = currentStateFn(userCase);

    const sections = Array.from(Array(8)).map((__ignored, index) => {
      return {
        title: (l: AnyRecord): string => l[`section${index + 1}`].title,
        links: sectionIndexToLinkNames[index].map(linkName => {
          const link = userCase.hubLinks[linkName];
          return {
            url: link.link,
            linkTxt: (l: AnyRecord): string => l[linkName],
            status: (l: AnyRecord): string => l[link.status],
            statusColor: () => hubLinksMap.get(link.status),
          };
        }),
      };
    });

    res.render(TranslationKeys.CITIZEN_HUB, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      PageUrls,
      userCase,
      currentState,
      sections,
      hideContactUs: true,
    });
  }
}
