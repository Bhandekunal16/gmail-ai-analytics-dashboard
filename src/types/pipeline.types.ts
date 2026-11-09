export interface PipelineStatus {
  lastKnownClassificationDate: string | null;
  latestSummaryAvailable: boolean;
  cronSchedule: string; // e.g. "0 23 * * * (Asia/Kolkata)"
  cronBatchLimit: number;
  cronDescription: string;
  trainerEndpointMounted: boolean;
  trainerEndpointStatusMessage: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}
