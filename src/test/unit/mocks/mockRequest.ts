import { Request } from 'express';

export const mockRequest = (data: any): Request => {
  const t = (): any => {
    return data;
  };

  const req = {
    t,
  } as unknown as Request;

  req.t = jest.fn().mockReturnValue(req);
  return req;
};
