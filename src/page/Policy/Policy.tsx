import { useNavigate } from "react-router-dom";
import PolicyScroll from "@/components/common/PolicyScroll";
import DataThresholdSlider from "./components/DataThresholdSlider";
import PermissionManager from "./components/Permisssion";
import UserInfo from "./components/UserInfo";
import SettingIcon from "@/assets/icon/setting.svg";
import AssignIcon from "@/assets/icon/assignment.svg";
import type { FamilyMember } from "@/types/FamilyMember";
import { useState } from "react";
import Avatar from "@/components/common/Avatar";
import { createPortal } from "react-dom";

export default function Policy() {
  const navigate = useNavigate();
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<FamilyMember | null>(
    null,
  );
  const [confirmText, setConfirmText] = useState("");
  const [familyMembers] = useState<FamilyMember[]>([
    {
      isMe: false,
      lineId: 100,
      userId: 1,
      userName: "김아내",
      role: "MEMBER",
      remainingData: 1600,
      basicDataAmount: 2000,
      sharedPoolRemainingAmount: 2000,
      sharedPoolTotalAmount: 2000,
    },
    {
      isMe: false,
      lineId: 102,
      userId: 2,
      userName: "박아들",
      role: "MEMBER",
      remainingData: 1600,
      basicDataAmount: 2000,
      sharedPoolRemainingAmount: 2000,
      sharedPoolTotalAmount: 2000,
    },
  ]);

  async function handleTransfer() {
    await fetch(`/api/families/owner?userId=${selectedTarget?.userId}`, {
      method: "PATCH",
    });
    setIsTransferModalOpen(false);
    window.location.reload();
  }

  return (
    <div className="relative h-[calc(100dvh-106px-60px)] overflow-y-auto mt-[106px] mb-[60px]">
      <div className="min-h-full flex flex-col gap-5 px-6 pb-[60px]">
        {/* 사용자 정보 영역 */}
        {/* /api/data/usages/balances 로 사용자 정보 받아오기 */}
        <UserInfo
          userName="김영희"
          lineId={3}
          isOwner={true}
          planName="5G 라이트"
          isDualPhone={true}
          sharedDataRemaining={2500}
          personalDataRemaining={2500}
          isBlocked={false}
        />

        {/* 현재 적용중인 정책 영역 */}
        {/* /api/data/usages/balances로 데이터 넘기기 */}
        <PolicyScroll
          policies={[
            {
              id: 1,
              type: "한도",
              bgColor: "#FFE5E5",
              title: "공유 데이터 한도 1GB로 제한",
            },
            {
              id: 2,
              type: "시간",
              bgColor: "#E5E5FF",
              title: "10:00 ~ 12:00 데이터 사용 제한",
            },
            {
              id: 3,
              type: "앱",
              bgColor: "#E5F5E5",
              title: "SNS 앱 사용 제한",
            },
          ]}
          title="현재 적용중인 정책"
        />

        {/* 데이터 임계치 설정 영역(가족 공유 데이터 임계치, 개인 데이터 임계치) */}
        {/* 가족 공유 데이터: 대표자만 접근 가능
        /api/shared-pools/limit로 데이터 넘기기
        개인 데이터 임계치 설정: 각자 자신의 것
        /api/lines/thresholds로 데이터 넘기기 */}
        <DataThresholdSlider
          isOwner={false}
          individualThreshold={3}
          familyThreshold={2}
        />

        {/* 권한 관리 */}
        {/* /api/member-permissions/family 같은데.. 이런식으로 오지 않음 물어보기 */}
        <PermissionManager
          members={[
            {
              userId: 1,
              userName: "김아내",
              canViewDetail: true,
              canHideAppUsage: false,
            },
            {
              userId: 2,
              userName: "박아들",
              canViewDetail: true,
              canHideAppUsage: true,
            },
            {
              userId: 3,
              userName: "박딸",
              canViewDetail: true,
              canHideAppUsage: true,
            },
          ]}
          onApply={() => {}}
        />

        <button
          onClick={() => navigate("/policy-detail")}
          className="w-full flex items-center gap-4 px-4 py-3 bg-white/60 rounded-2xl shadow-sm border border-gray-100"
        >
          {/* 아이콘 영역 */}
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
            <img src={SettingIcon} />
          </div>

          {/* 텍스트 */}
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-gray-800">
              구성원별 정책 제어
            </span>
            <span className="text-xs text-gray-400">
              데이터 한도, 속도 등을 설정하세요.
            </span>
          </div>
        </button>

        <button
          onClick={() => setIsTransferModalOpen(true)}
          className="w-full flex items-center gap-4 px-4 py-3 bg-white/60 rounded-2xl shadow-sm border border-gray-100"
        >
          {/* 아이콘 영역 */}
          <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center flex-shrink-0">
            <img src={AssignIcon} />
          </div>

          {/* 텍스트 */}
          <div className="flex flex-col items-start">
            <span className="text-sm font-semibold text-gray-800">
              권한 양도
            </span>
            <span className="text-xs text-gray-400">
              대표자 권한을 양도할 구성원을 고르세요.
            </span>
          </div>
        </button>

        {/* 권한 양도 모달 */}
        {/* createPortal을 사용하면 부모 컴포넌트의 overflow, z-index 영향을 받지 않고 렌더링 가능 */}
        {isTransferModalOpen &&
          createPortal(
            <>
              <div
                className="fixed inset-0 bg-black/40 z-[200]"
                onClick={() => {
                  setIsTransferModalOpen(false);
                  setSelectedTarget(null);
                  setConfirmText("");
                }}
              />
              <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[201] bg-white rounded-2xl p-6 max-w-sm mx-auto">
                <h3 className="text-base font-bold text-gray-800 mb-4">
                  권한 양도
                </h3>

                {/* 구성원 선택 */}
                <p className="text-sm text-gray-500 mb-3">
                  양도할 구성원을 선택하세요
                </p>
                <div className="flex flex-col gap-2 mb-5">
                  {familyMembers
                    .filter((m) => m.role !== "OWNER")
                    .map((member, index) => (
                      <button
                        key={member.userId}
                        onClick={() => setSelectedTarget(member)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                          selectedTarget?.userId === member.userId
                            ? "border-[#678BF7] bg-blue-50"
                            : "border-gray-100 bg-gray-50"
                        }`}
                      >
                        <Avatar userName={member.userName} colorIndex={index} />
                        <span className="text-sm font-medium text-gray-800">
                          {member.userName}
                        </span>
                        {selectedTarget?.userId === member.userId && (
                          <span className="ml-auto text-[#678BF7]">✓</span>
                        )}
                      </button>
                    ))}
                </div>

                {/* 텍스트 검증 */}
                <p className="text-sm text-gray-500 mb-2">
                  확인을 위해{" "}
                  <span className="font-semibold text-gray-800">
                    권한을 양도합니다
                  </span>
                  를 입력하세요
                </p>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="권한을 양도합니다"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#678BF7] mb-5"
                />

                {/* 버튼 */}
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setIsTransferModalOpen(false);
                      setSelectedTarget(null);
                      setConfirmText("");
                    }}
                    className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleTransfer}
                    disabled={
                      !selectedTarget || confirmText !== "권한을 양도합니다"
                    }
                    className="flex-1 py-3 bg-[#678BF7] text-white rounded-xl text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    양도하기
                  </button>
                </div>
              </div>
            </>,
            document.body,
          )}
      </div>
    </div>
  );
}
