import * as crypto from 'crypto';

import config from 'config';

import { PCQRequest } from '.';

const algorithm = 'aes-256-gcm';
const bufferSize = 16;
const iv = Buffer.alloc(bufferSize, 0);
const keyLen = 32;

export const createToken = (params: PCQRequest): string => {
  const tokenKey: crypto.BinaryLike = config.get('services.pcq.token');
  let encrypted = '';

  if (tokenKey) {
    const key = crypto.scryptSync(tokenKey, 'salt', keyLen);
    Object.keys(params).forEach((p: keyof typeof params) => {
      params[p] = String(params[p]);
    });

    const paramsJson: string = JSON.stringify(params);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    encrypted = cipher.update(paramsJson, 'utf-8', 'hex');
    encrypted += cipher.final('hex');
  }
  return encrypted;
};
