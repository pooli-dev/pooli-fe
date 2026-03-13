export type SharedPoolThreshold = {
  isThresholdActive: boolean;
  familyThreshold: number;
  minThreshold: number;
  maxThreshold: number;
};

export type LineThreshold = {
  individualThreshold: number;
  isThresholdActive: boolean;
  thresholdMinValue: number;
  thresholdMaxValue: number;
};
