/**
 * Service selector.
 *
 * Reads VITE_USE_MOCK_API at build time and re-exports the appropriate
 * implementation. Components should import from this file only –
 * never directly from api.ts or mockApi.ts.
 *
 * To switch to the real backend:
 *   1. Set VITE_USE_MOCK_API=false in .env.local
 *   2. Set VITE_API_BASE_URL to the real backend URL
 *   3. Restart the dev server (`npm run dev`)
 */

import * as realApi from './api';
import * as mockApi from './mockApi';

const useMock =
  (import.meta.env.VITE_USE_MOCK_API as string | undefined) === 'true';

const service = useMock ? mockApi : realApi;

export const { analyzeImage, healthCheck, getModels } = service;
export { useMock };
