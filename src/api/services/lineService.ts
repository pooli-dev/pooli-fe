// api/services/lineService.ts
import type { Line } from "@/types/line";
import { apiClient } from "../client";

export interface LineByPhoneResult {
  lineId: number;
  phone: string;
  userId: number;
  userName: string;
  email: string;
}

export const lineService = {
  getLines: () => apiClient.get<Line[]>("/lines"),
  switchLine: (lineId: number) => apiClient.patch(`/lines?lineId=${lineId}`),
  getLinesByPhone: (phone: string) =>
    apiClient.get<LineByPhoneResult[]>("/lines/by-phone", { params: { phone } }),
};
