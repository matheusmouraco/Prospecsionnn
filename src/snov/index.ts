import { getEnv, requireEnv } from '../config/env.js';
import { SnovClient } from './client.js';

export function snovClientFromEnv(): SnovClient {
  getEnv();
  return new SnovClient({
    clientId: requireEnv('SNOV_CLIENT_ID'),
    clientSecret: requireEnv('SNOV_CLIENT_SECRET'),
  });
}
