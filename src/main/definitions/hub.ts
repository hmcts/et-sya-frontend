export const createHubSections = (): HubSection[] => {
  const sections: HubSection[] = [];

  for (let i = 1; i <= 8; i++) {
    if (i === 5) {
      sections.push({
        links: [
          { status: HubLinkStatus.NOT_YET_AVAILABLE },
          { status: HubLinkStatus.NOT_YET_AVAILABLE },
          { status: HubLinkStatus.NOT_YET_AVAILABLE },
        ],
      });
    } else {
      sections.push({ links: [{ status: HubLinkStatus.NOT_YET_AVAILABLE }] });
    }
  }

  return sections;
};

export interface HubSection {
  links: HubLink[];
}

export interface HubLink {
  status: HubLinkStatus;
  link?: string;
}

export const enum HubLinkStatus {
  COMPLETED = 'completed',
  SUBMITTED = 'submitted',
  OPTIONAL = 'optional',
  VIEWED = 'viewed',
  NOT_YET_AVAILABLE = 'notAvailableYet',
}

export const hubLinksMap = new Map<HubLinkStatus, string>([
  [HubLinkStatus.COMPLETED, '--green'],
  [HubLinkStatus.SUBMITTED, '--turquoise'],
  [HubLinkStatus.VIEWED, '--turquoise'],
  [HubLinkStatus.OPTIONAL, '--blue'],
  [HubLinkStatus.NOT_YET_AVAILABLE, '--grey'],
]);
