import { AppRequest } from '../../../main/definitions/appRequest';
import { DefaultValues } from '../../../main/definitions/constants';
import UrlUtils from '../../../main/utils/UrlUtils';
import { mockRequest } from '../mocks/mockRequest';

describe('UrlUtils tests', () => {
  const t = {
    common: {},
  };
  const request: AppRequest = mockRequest({ t });
  request.url = 'http://localhost:8080';
  describe('removeParameterFromUrl tests', () => {
    it.each([
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy&test=test',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test&redirect=clearSelection',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection&test=test',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?test=test&redirect=clearSelection&lng=cy',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?test=test&lng=cy',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim?lng=cy',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        parameter: 'redirect=clearSelection',
        result: 'https://localhost:3003/employers-contract-claim',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        parameter: '',
        result: 'https://localhost:3003/employers-contract-claim',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        parameter: ' ',
        result: 'https://localhost:3003/employers-contract-claim',
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        parameter: undefined,
        result: 'https://localhost:3003/employers-contract-claim',
      },
      { url: undefined, parameter: 'redirect=clearSelection', result: undefined },
      { url: DefaultValues.STRING_SPACE, parameter: 'redirect=clearSelection', result: DefaultValues.STRING_SPACE },
      { url: DefaultValues.STRING_EMPTY, parameter: 'redirect=clearSelection', result: DefaultValues.STRING_EMPTY },
    ])('check if given parameter is removed from url: %o', ({ url, parameter, result }) => {
      expect(UrlUtils.removeParameterFromUrl(url, parameter)).toStrictEqual(result);
    });
  });
  describe('getRequestParamsFromUrl tests', () => {
    it.each([
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy',
        result: ['redirect=clearSelection', 'lng=cy'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection&lng=cy&test=test',
        result: ['redirect=clearSelection', 'lng=cy', 'test=test'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?redirect=clearSelection',
        result: ['redirect=clearSelection'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&test=test&redirect=clearSelection',
        result: ['lng=cy', 'test=test', 'redirect=clearSelection'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection&test=test',
        result: ['lng=cy', 'redirect=clearSelection', 'test=test'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?test=test&redirect=clearSelection&lng=cy',
        result: ['test=test', 'redirect=clearSelection', 'lng=cy'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim?lng=cy&redirect=clearSelection',
        result: ['lng=cy', 'redirect=clearSelection'],
      },
      {
        url: 'https://localhost:3003/employers-contract-claim',
        result: [],
      },
      { url: undefined, result: [] },
      { url: DefaultValues.STRING_SPACE, result: [] },
      { url: DefaultValues.STRING_EMPTY, result: [] },
    ])('check if given urls parameters are listed as string list: %o', ({ url, result }) => {
      expect(UrlUtils.getRequestParamsFromUrl(url)).toStrictEqual(result);
    });
  });
});
