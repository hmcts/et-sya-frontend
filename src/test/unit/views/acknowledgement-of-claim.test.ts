import request from 'supertest';

import { HubLinksStatuses } from '../../../main/definitions/hub';
import { mockApp } from '../mocks/mockApp';

const PAGE_URL = '/case-document/acknowledgement-of-claim';
const titleClass = 'govuk-heading-xl';
const documentLinkSelector = 'td.govuk-table__cell a.govuk-link';

let htmlRes: Document;

describe('Citizen Hub acknowledgement of Claim', () => {
  beforeAll(async () => {
    await request(
      mockApp({
        userCase: {
          acknowledgementOfClaimLetterDetail: [
            { id: 'abc123', description: 'text', originalDocumentName: 'sample.pdf' },
          ],
          hubLinksStatuses: new HubLinksStatuses(),
        },
      })
    )
      .get(PAGE_URL)
      .then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
  });

  it('should display title', () => {
    const title = htmlRes.getElementsByClassName(titleClass);
    expect(title[0].innerHTML).toContain('Acknowledgement of Claim');
  });

  it('should display clickable links to download the documents', () => {
    const documentLinks = htmlRes.querySelectorAll(documentLinkSelector);
    expect(documentLinks).toHaveLength(1);
    expect(documentLinks[0].innerHTML).toContain('sample.pdf');
  });
});
