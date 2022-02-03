import { Response } from 'express';
import sinon from 'sinon';

import SingleOrMultipleController from '../../../main/controllers/SingleOrMultipleController';
import { URLS } from '../../../main/definitions/constants';
import { mockRequest } from '../mocks/mockRequest';

const singleOrMultipleController = new SingleOrMultipleController();

describe('Single or Multiple Claim Controller', () => {
  const t = {
    'single-or-multiple-claim': {},
  };

  it('should render single or multiple claim page', () => {
    const response = { render: () => '' } as unknown as Response;
    const request = mockRequest({ t });

    const responseMock = sinon.mock(response);

    responseMock
      .expects('render')
      .once()
      .withArgs('single-or-multiple-claim', request.t('single-or-multiple-claim', { returnObjects: true }));

    singleOrMultipleController.get(request, response);
    responseMock.verify();
  });

  it("should render the next page when 'single' is selected", () => {
    const response = {
      redirect: () => {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest({ t });
    request.body = { 'single-or-multiple': 'single' };

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('/do-you-have-an-acas-single-resps');

    singleOrMultipleController.post(request, response);
    responseMock.verify();
  });

  it("should render the legacy ET1 service when the 'making a claim for someone else' option is selected", () => {
    const response = {
      redirect: () => {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest({ t });
    request.body = { 'single-or-multiple': 'multiple' };

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs(URLS.LEGACY_ET1);

    singleOrMultipleController.post(request, response);
    responseMock.verify();
  });

  it('should render same page if nothing selected', () => {
    const response = {
      render: () => {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest({ t });
    request.body = { 'single-or-multiple': '' };

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('single-or-multiple-claim');

    singleOrMultipleController.post(request, response);
    responseMock.verify();
  });
});
