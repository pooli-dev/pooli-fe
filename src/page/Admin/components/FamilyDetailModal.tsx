import { useQuery } from "@tanstack/react-query";
import { familyService, sharedPoolService } from "@/api";
import type { FamilyMembersByLineResponse } from "@/api/services/familyService";
import type { SharedData } from "@/types/SharedData";
import Avatar from "@/components/common/Avatar";
import ClockIcon from "@/assets/icon/clock2.svg";
import GradientButton from "@/components/common/GradientButton";
import { useNavigate } from "react-router-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  lineId?: number;
};

const COLORS = {
  primary: "#678BF7",
  secondary: "#9A9CEA",
  textGray: "#808692",
  textDark: "#374151",
  textLight: "#9CA3AF",
  danger: "#BA7E7D",
  divider: "#F3F4F6",
} as const;

function calculateDaysUntilNextMonth(): number {
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const diffTime = nextMonth.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export default function FamilyDetailModal({ isOpen, onClose, lineId }: Props) {
  const navigate = useNavigate();

  const { data: familyData, isLoading: isFamilyLoading } = useQuery<FamilyMembersByLineResponse>({
    queryKey: ["familyMembersByLine", lineId],
    queryFn: () => familyService.getMembersByLine(lineId!).then((res) => res.data),
    enabled: isOpen && !!lineId,
  });

  const { data: sharedPoolData, isLoading: isPoolLoading } = useQuery<SharedData>({
    queryKey: ["sharedPool"],
    queryFn: () => sharedPoolService.getMainRemainingAmount(),
    enabled: isOpen,
  });

  if (!isOpen) return null;

  const isLoading = isFamilyLoading || isPoolLoading;
  const remainingDays = calculateDaysUntilNextMonth();

  const usedData = sharedPoolData
    ? sharedPoolData.sharedPoolTotalData - sharedPoolData.sharedPoolRemainingData
    : 0;

  const usagePercent = sharedPoolData && sharedPoolData.sharedPoolTotalData > 0
    ? (usedData / sharedPoolData.sharedPoolTotalData) * 100
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-900">가족 상세 정보</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="p-6 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-[#678BF7] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* 공유 데이터 풀 정보 */}
              {sharedPoolData && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-semibold text-gray-800">총 공유 데이터</h3>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-600">
                      D-{remainingDays}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <div className="text-3xl font-bold" style={{ color: COLORS.primary }}>
                        {sharedPoolData.sharedPoolTotalData.toFixed(2)} GB
                      </div>
                      <GradientButton
                        onClick={() => {
                          onClose();
                          navigate("/log");
                        }}
                        width={20}
                        height={8}
                        borderRadius={15}
                      >
                        <img src={ClockIcon} className="w-4 h-4" alt="clock" />
                        <span className="text-xs whitespace-nowrap">사용 로그</span>
                      </GradientButton>
                    </div>

                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-gray-500">기본 공유</span>
                        <div className="font-semibold text-base text-gray-800">
                          {sharedPoolData.sharedPoolBaseData.toFixed(2)} GB
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">가족 추가</span>
                        <div className="font-semibold text-base text-gray-800">
                          {sharedPoolData.sharedPoolAdditionalData.toFixed(2)} GB
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-blue-200 pt-4">
                    <div className="text-xs mb-2 text-gray-600">현재 사용량</div>
                    <div className="flex items-center gap-3 text-xs text-gray-600">
                      <div className="flex-1 h-3 rounded-full bg-white/60 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${usagePercent}%`,
                            background: `linear-gradient(to right, ${COLORS.primary}, ${COLORS.secondary})`,
                          }}
                        />
                      </div>
                      <span className="whitespace-nowrap">
                        사용 {usedData.toFixed(2)}GB / 잔여 {sharedPoolData.sharedPoolRemainingData.toFixed(2)}GB
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 가족 구성원 정보 */}
              {familyData && (
                <div>
                  <h3 className="text-base font-semibold text-gray-800 mb-4">가족 구성원</h3>
                  <div className="space-y-3">
                    {familyData.members.map((member) => {
                      const isOwner = member.role === "OWNER";

                      return (
                        <div
                          key={member.lineId}
                          className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center gap-3">
                            <Avatar
                              userName={member.userName}
                              isOwner={isOwner}
                              colorIndex={member.userId}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-900">{member.userName}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                  {isOwner ? "대표자" : "구성원"}
                                </span>
                              </div>
                              <div className="text-xs text-gray-500">{member.phone}</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
