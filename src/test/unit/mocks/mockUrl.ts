import url from 'url';

export const safeUrlMock = {
  host: 'http://localhost:3002',
} as url.UrlWithStringQuery;

export const dodgyUrlMock = {
  host: 'http://dodgy.com',
  href: 'http://dodgy.com',
} as url.UrlWithStringQuery;
