// utils/dataFormat.ts

// Byte → GB 변환 (1GB = 1e9 Bytes)
export const bytesToGb = (bytes: number): number => {
  return Math.round((bytes / 1e9) * 100) / 100;
};

// Byte → MB 변환
export const bytesToMb = (bytes: number): number => {
  return Math.round((bytes / 1e6) * 100) / 100;
};

// GB/MB 자동 선택해서 포맷 (예: "1.5GB", "500MB")
export const formatData = (bytes: number): string => {
  const gb = bytes / 1e9;
  if (gb >= 1) return `${Math.round(gb * 10) / 10}GB`;
  return `${Math.round(bytes / 1e6)}MB`;
};
