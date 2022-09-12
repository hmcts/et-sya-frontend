import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { HubLinks, hubLinksMap, sectionIndexToLinkNames } from '../definitions/hub';
import { AnyRecord } from '../definitions/util-types';
import { fromApiFormat } from '../helper/ApiFormatter';
import { currentStateFn } from '../helper/state-sequence';
import { getCaseApi } from '../services/CaseService';

const { Logger } = require('@hmcts/nodejs-logging');

const logger = Logger.getLogger('app');

export default class CitizenHubController {
  public async get(req: AppRequest, res: Response): Promise<void> {
    try {
      req.session.userCase = fromApiFormat(
        (await getCaseApi(req.session.user?.accessToken).getCase(req.params.caseId)).data
      );
    } catch (error) {
      logger.error(`Could not access /citizen-hub/${req.params.caseId}`);
      return res.redirect('/not-found');
    }

    const userCase = req.session.userCase;

    userCase.hubLinks = userCase.hubLinks || new HubLinks();

    const currentState = currentStateFn(userCase);

    const showAcknowledgementAlert = !!userCase?.acknowledgementOfClaimLetterDetail?.id;

    const sections = Array.from(Array(8)).map((__ignored, index) => {
      return {
        title: (l: AnyRecord): string => l[`section${index + 1}`],
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

    console.log('showAlert is ', showAcknowledgementAlert);
    res.render(TranslationKeys.CITIZEN_HUB, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      PageUrls,
      userCase,
      currentState,
      sections,
      hideContactUs: true,
      showAcknowledgementAlert,
    });
  }
}
