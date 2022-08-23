import { Response } from 'express';

import { AppRequest } from '../definitions/appRequest';
import { CaseWithId, YesOrNo } from '../definitions/case';
import { PageUrls, TranslationKeys } from '../definitions/constants';
import { CaseState, HubLinkStatus, hubLinksMap } from '../definitions/definition';
import { AnyRecord } from '../definitions/util-types';
import { currentStateFn } from '../helper/state-sequence';

export default class CitizenHubController {
  public get(req: AppRequest, res: Response): void {
    let userCase = req.session?.userCase;

    // todo remove this.
    if (!userCase) {
      userCase = {
        id: '123',
        ethosCaseReference: '654321/2022',
        firstName: 'Paul',
        lastName: 'Mumbere',
        respondents: [{ respondentNumber: 1, respondentName: 'Itay' }],
        state: CaseState.ACCEPTED,
        et3IsThereAnEt3Response: YesOrNo.YES,
        hubLinkStatuses: {
          hubS1LinkStatus: HubLinkStatus.COMPLETED,
          hubS2LinkStatus: HubLinkStatus.VIEWED,
          hubS3LinkStatus: HubLinkStatus.NOT_YET_AVAILABLE,
          hubS4LinkStatus: HubLinkStatus.SUBMITTED,
          hubS5Link1Status: HubLinkStatus.OPTIONAL,
          hubS5Link2Status: HubLinkStatus.OPTIONAL,
          hubS5Link3Status: HubLinkStatus.OPTIONAL,
          hubS6LinkStatus: HubLinkStatus.OPTIONAL,
          hubS7LinkStatus: HubLinkStatus.OPTIONAL,
          hubS8LinkStatus: HubLinkStatus.OPTIONAL,
        },
      } as CaseWithId;
    }

    const sections = [
      {
        title: (l: AnyRecord): string => l.section1.title,
        links: [
          {
            url: PageUrls.HOME,
            linkTxt: (l: AnyRecord): string => l.section1.link1Text,
            status: (l: AnyRecord): string => l[userCase.hubLinkStatuses.hubS1LinkStatus],
            statusColor: () => hubLinksMap.get(userCase.hubLinkStatuses.hubS1LinkStatus),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section2.title,
        links: [
          {
            url: PageUrls.HOME,
            linkTxt: (l: AnyRecord): string => l.section2.link1Text,
            status: (l: AnyRecord): string => l[userCase.hubLinkStatuses.hubS2LinkStatus],
            statusColor: () => hubLinksMap.get(userCase.hubLinkStatuses.hubS2LinkStatus),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section3.title,
        links: [
          {
            url: PageUrls.HOME,
            linkTxt: (l: AnyRecord): string => l.section3.link1Text,
            status: (l: AnyRecord): string => l[userCase.hubLinkStatuses.hubS3LinkStatus],
            statusColor: () => hubLinksMap.get(userCase.hubLinkStatuses.hubS3LinkStatus),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section4.title,
        links: [
          {
            url: PageUrls.HOME,
            linkTxt: (l: AnyRecord): string => l.section4.link1Text,
            status: (l: AnyRecord): string => l[userCase.hubLinkStatuses.hubS4LinkStatus],
            statusColor: () => hubLinksMap.get(userCase.hubLinkStatuses.hubS4LinkStatus),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section5.title,
        links: [
          {
            url: PageUrls.HOME,
            linkTxt: (l: AnyRecord): string => l.section5.link1Text,
            status: (l: AnyRecord): string => l[userCase.hubLinkStatuses.hubS5Link1Status],
            statusColor: () => hubLinksMap.get(userCase.hubLinkStatuses.hubS5Link1Status),
          },
          {
            url: PageUrls.HOME,
            linkTxt: (l: AnyRecord): string => l.section5.link2Text,
            status: (l: AnyRecord): string => l[userCase.hubLinkStatuses.hubS5Link2Status],
            statusColor: () => hubLinksMap.get(userCase.hubLinkStatuses.hubS5Link2Status),
          },
          {
            url: PageUrls.HOME,
            linkTxt: (l: AnyRecord): string => l.section5.link3Text,
            status: (l: AnyRecord): string => l[userCase.hubLinkStatuses.hubS5Link3Status],
            statusColor: () => hubLinksMap.get(userCase.hubLinkStatuses.hubS5Link3Status),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section6.title,
        links: [
          {
            url: PageUrls.HOME,
            linkTxt: (l: AnyRecord): string => l.section6.link1Text,
            status: (l: AnyRecord): string => l[userCase.hubLinkStatuses.hubS6LinkStatus],
            statusColor: () => hubLinksMap.get(userCase.hubLinkStatuses.hubS6LinkStatus),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section7.title,
        links: [
          {
            url: PageUrls.HOME,
            linkTxt: (l: AnyRecord): string => l.section7.link1Text,
            status: (l: AnyRecord): string => l[userCase.hubLinkStatuses.hubS7LinkStatus],
            statusColor: () => hubLinksMap.get(userCase.hubLinkStatuses.hubS7LinkStatus),
          },
        ],
      },
      {
        title: (l: AnyRecord): string => l.section8.title,
        links: [
          {
            url: PageUrls.HOME,
            linkTxt: (l: AnyRecord): string => l.section8.link1Text,
            status: (l: AnyRecord): string => l[userCase.hubLinkStatuses.hubS8LinkStatus],
            statusColor: () => hubLinksMap.get(userCase.hubLinkStatuses.hubS8LinkStatus),
          },
        ],
      },
    ];

    //todo maybe set default values to statuses.

    const currentState = currentStateFn(userCase);

    res.render(TranslationKeys.CITIZEN_HUB, {
      ...req.t(TranslationKeys.COMMON, { returnObjects: true }),
      ...req.t(TranslationKeys.CITIZEN_HUB, { returnObjects: true }),
      PageUrls,
      userCase,
      currentState,
      sections,
    });
  }
}
