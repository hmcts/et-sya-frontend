import { AppRequest } from '../../definitions/appRequest';
import { StillWorking } from '../../definitions/case';
import { AnyRecord } from '../../definitions/util-types';

export const checkCyaErrorsList = (req: AppRequest<Partial<AnyRecord>>): void => {
  const userCase = req.session?.userCase;
  if (userCase?.typeOfClaim === undefined || userCase?.typeOfClaim.length === 0) {
    if (req.session.errors === undefined) {
      req.session.errors = [];
    }
    req.session.errors.push({ propertyName: 'typeOfClaim', errorType: 'required' });
  }

  if (userCase?.isStillWorking === StillWorking.NO_LONGER_WORKING && userCase?.endDate === undefined) {
    if (req.session.errors === undefined) {
      req.session.errors = [];
    }
    req.session.errors.push({ propertyName: 'typeOfClaim', errorType: 'required' });
  }
};
