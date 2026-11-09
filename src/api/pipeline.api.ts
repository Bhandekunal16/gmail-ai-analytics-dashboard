import { apiClient, isDemoModeEnabled } from './axios';
import { PipelineStatus } from '../types/pipeline.types';
import { MOCK_PIPELINE_STATUS } from './mockData';
import { getKolkataDateString } from '../utils/date';

export const pipelineApi = {
  async getPipelineStatus(): Promise<PipelineStatus> {
    if (isDemoModeEnabled()) {
      return MOCK_PIPELINE_STATUS;
    }

    // Check if /trainer/run is mounted or returns 404
    let trainerMounted = false;
    let trainerMessage = 'POST /trainer/run is not mounted in Express (404 Not Found). Pipeline execution is handled externally.';

    try {
      const probeRes = await apiClient.post('/trainer/run', {}, { timeout: 3000, validateStatus: () => true });
      if (probeRes.status === 200 || probeRes.status === 202) {
        trainerMounted = true;
        trainerMessage = 'POST /trainer/run is operational on the backend.';
      } else if (probeRes.status === 404) {
        trainerMounted = false;
        trainerMessage = 'Endpoint POST /trainer/run returned 404. Classification algorithm is not exposed via HTTP.';
      } else {
        trainerMessage = `Endpoint returned HTTP ${probeRes.status}: ${probeRes.statusText}`;
      }
    } catch {
      trainerMounted = false;
    }

    return {
      lastKnownClassificationDate: getKolkataDateString(),
      latestSummaryAvailable: true,
      cronSchedule: '0 23 * * * (Asia/Kolkata)',
      cronBatchLimit: 50,
      cronDescription:
        'Nightly Node-cron job executes at 23:00 IST. It fetches up to 50 new Gmail messages for each active account. Note: it does NOT trigger the Python classification algorithm.',
      trainerEndpointMounted: trainerMounted,
      trainerEndpointStatusMessage: trainerMessage,
    };
  },

  // Probing trigger function
  async probeTrainerEndpoint(): Promise<{ mounted: boolean; status: number; message: string }> {
    try {
      const res = await apiClient.post('/trainer/run', {}, { timeout: 4000, validateStatus: () => true });
      return {
        mounted: res.status >= 200 && res.status < 300,
        status: res.status,
        message: res.status === 404
          ? 'POST /trainer/run is currently not mounted in the Express application (HTTP 404).'
          : `Endpoint responded with status code ${res.status}.`,
      };
    } catch (err: any) {
      return {
        mounted: false,
        status: 0,
        message: err.message || 'Connection to backend failed.',
      };
    }
  },
};
