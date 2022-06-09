import axios, { AxiosResponse } from 'axios';
import config from 'config';
import { Response } from 'express';
import i18next from 'i18next';
import { uuid } from 'uuidv4';

import { AppRequest } from '../definitions/appRequest';
import { HTTPS_PROTOCOL, PageUrls } from '../definitions/constants';

import { createToken } from './createToken';

export interface HealthResponse {
  status: string;
}

export interface PCQRequest {
  serviceId?: string;
  actor?: string;
  pcqId?: string;
  ccdCaseId?: string;
  partyId?: string;
  returnUrl?: string;
  language?: string;
  token?: string;
}

const { Logger } = require('@hmcts/nodejs-logging');
const logger = Logger.getLogger('app');

const isEnabled = (): boolean => {
  return process.env.PCQ_ENABLED === 'true' || config.get('services.pcq.enabled') === 'true';
};

export const invokePCQ = async (req: AppRequest, res: Response): Promise<void> => {
  if (isEnabled()) {
    const healthResp = await callPCQHealth();
    const pcqUrl: string = config.get('services.pcq.url');

    if (!req.session.userCase?.ClaimantPcqId && healthResp.data.status === 'UP') {
      //call pcq
      logger.info('Calling the PCQ Service');
      const returnurl = HTTPS_PROTOCOL + req.headers.host + PageUrls.CHECK_ANSWERS;

      //Generate pcq id
      const claimantPcqId: string = uuid();

      const params: PCQRequest = {
        serviceId: 'ET',
        actor: 'Claimant',
        pcqId: claimantPcqId,
        ccdCaseId: req.session.userCase.id,
        partyId: req.session.user?.email ? req.session.user.email : 'anonymous',
        returnUrl: returnurl,
        language: i18next.language || 'en',
      };

      params.token = createToken(params);
      params.partyId = encodeURIComponent(params.partyId);

      const qs: string = Object.keys(params)
        .map((key: keyof typeof params) => `${key}=${params[key]}`)
        .join('&');

      req.session.userCase.ClaimantPcqId = claimantPcqId;
      req.session.save();

      res.redirect(`${pcqUrl}?${qs}`);
    } else {
      //skip pcq
      res.redirect(PageUrls.CHECK_ANSWERS);
    }
  } else {
    //skip pcq
    res.redirect(PageUrls.CHECK_ANSWERS);
  }
};

export const callPCQHealth = (): Promise<AxiosResponse> => {
  const url: string = config.get('services.pcq.health');
  logger.info(`PCQ health ${url}`);
  return axios.get(url);
};
