import request from 'supertest';

import { CaseWithId } from '../../../main/definitions/case';
import { mockApp } from '../mocks/mockApp';

// Request page and return html response
export const getHtmlRes = (userCase: CaseWithId, url: string): Promise<Document> => {
  return request(mockApp({ userCase }))
    .get(url)
    .then(res => {
      return new DOMParser().parseFromString(res.text, 'text/html');
    });
};
