import { AppRequest } from '../../definitions/appRequest';
import { Logger } from '../../logger';
import { getCaseApi } from '../../services/CaseService';

export const storeClaimantTse = async (req: AppRequest, logger: Logger): Promise<void> => {
  try {
    await getCaseApi(req.session.user?.accessToken).storeClaimantTse(req.session.userCase);
    logger.info(`Stored claimant tse for case: ${req.session.userCase.id}`);
  } catch (error) {
    logger.error(error.message);
  }
};
export const storedToSubmitClaimantTse = async (req: AppRequest, logger: Logger): Promise<void> => {
  try {
    await getCaseApi(req.session.user?.accessToken).storedToSubmitClaimantTse(req.session.userCase);
    logger.info(`Stored claimant tse for case: ${req.session.userCase.id}`);
  } catch (error) {
    logger.error(error.message);
  }
};
