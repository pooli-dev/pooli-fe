export type LineLimitResponse = {
  lineLimitId: number;
  dailyDataLimit: number;
  isDailyDataLimitActive: boolean;
  sharedDataLimit: number;
  isSharedDataLimitActive: boolean;
  maxSharedData: number;
  maxDailyData: number;
};
