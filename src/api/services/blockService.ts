import { apiClient } from "../client";

type BlockStatus = {
  blockEndsAt: string;
  blocked: boolean;
};

export const blockService = {
  getBlockStatus: (lineId: number) =>
    apiClient.get<BlockStatus>("/policies/lines/block-status", {
      params: { lineId },
    }),
};
