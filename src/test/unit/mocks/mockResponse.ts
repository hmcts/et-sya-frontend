import { Response } from 'express';

export const mockResponse = (): Response => {
  const res: Partial<Response> = {};
  res.redirect = jest.fn().mockReturnValue(res);
  res.render = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn();
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  res.type = jest.fn().mockReturnValue(res);
  res.end = jest.fn();
  res.cookie = jest.fn();
  res.status = jest.fn().mockImplementation((code = 200) => {
    res.statusCode = code;
    return res;
  });

  return res as unknown as Response;
};
