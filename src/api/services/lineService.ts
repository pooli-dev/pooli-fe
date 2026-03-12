// api/services/lineService.ts
import type { Line } from "@/types/line";
import { apiClient } from "../client";

export const lineService = {
  getLines: () => apiClient.get<Line[]>("/lines"),
  switchLine: (lineId: number) => apiClient.patch(`/lines?lineId=${lineId}`),
};
