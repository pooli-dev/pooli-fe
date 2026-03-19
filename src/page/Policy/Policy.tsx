import { useNavigate } from "react-router-dom";
import PolicyScroll from "@/components/common/PolicyScroll";
import DataThresholdSlider from "./components/DataThresholdSlider";
import UserInfoCard from "./components/UserInfoCard";
import SettingIcon from "@/assets/icon/setting.svg";
import AssignIcon from "@/assets/icon/assignment.svg";
import type { FamilyApiResponse, SimpleMember } from "@/types/FamilyMember";
import { useState } from "react";
import Avatar from "@/components/common/Avatar";
import { createPortal } from "react-dom";
import { useUserStore } from "@/store/userStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { LineThreshold, SharedPoolThreshold } from "@/types/threshold";
import { useAppliedPolicies } from "../PolicyDetail/hooks/useAppliedPolicies";
import { familyService, thresholdService, userService } from "@/api";
import PermissionManager from "./components/Permisssion";
import { motion } from "framer-motion";
import {
  itemVariants,
  pageTransition,
  pageVariants,
} from "@/utils/pageAnimation";

export default function Policy() {
  const navigate = useNavigate();
  // store에 저장된 user 정보 가져오기
  const userData = useUserStore((state) => state.userInfo);
  const setUserInfo = useUserStore((state) => state.setUserInfo);

  //대표자인가
  const isOwner = userData?.role === "OWNER";

  // 현재 적용중인 정책 가져오기
  const { appliedPolicies } = useAppliedPolicies(userData?.lineId);

  // 공유 데이터 임계치 받아오기
  const { data: sharedPoolThreshold } = useQuery<SharedPoolThreshold>({
    queryKey: ["sharedPoolLimit"],
    queryFn: () =>
      thresholdService.getSharedPoolThreshold().then((res) => res.data),
    staleTime: 0, //페이지에 다시 진입할 때 마다 요청하기
  });

  // 개인 데이터 임계치 받아오기
  const { data: lineThreshold } = useQuery<LineThreshold>({
    queryKey: ["lineThreshold"],
    queryFn: () => thresholdService.getLineThreshold().then((res) => res.data),
    staleTime: 0,
  });

  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<SimpleMember | null>(
    null,
  );
  const [confirmText, setConfirmText] = useState("");

  // 가족 목록 조회
  const { data: familyMembers = [] } = useQuery<SimpleMember[]>({
    queryKey: ["familyMembersSimple"],
    queryFn: () => familyService.getMembersSimple().then((res) => res.data),
    enabled: isTransferModalOpen, // 모달 열릴 때만 요청
  });

  // 현재 유저의 userId를 familyMembers 캐시에서 찾기
  const { data: familyData } = useQuery<FamilyApiResponse>({
    queryKey: ["familyMembers"],
    queryFn: () => familyService.getMembers().then((res) => res.data),
    staleTime: Infinity,
  });
  const currentUserId = familyData?.members.find(
    (m) => m.lineId === userData?.lineId,
  )?.userId;
  // userId별 lineId 오름차순 정렬 후 lineIndex 매핑
  const lineIndexMap = new Map<number, number>();
  const userLineMap = new Map<number, number[]>();
  familyMembers.forEach((m) => {
    if (!userLineMap.has(m.userId)) userLineMap.set(m.userId, []);
    userLineMap.get(m.userId)!.push(m.lineId);
  });
  userLineMap.forEach((lineIds) => {
    lineIds
      .sort((a, b) => a - b)
      .forEach((lineId, index) => {
        lineIndexMap.set(lineId, index);
      });
  });

  // 권한 양도 mutation
  const { mutate: transferOwner, isPending } = useMutation({
    mutationFn: (changeLineId: number) =>
      familyService.transferOwner(changeLineId),
    onSuccess: async () => {
      setIsTransferModalOpen(false);
      setSelectedTarget(null);
      setConfirmText("");
      // 유저 정보 다시 fetch해서 store 업데이트
      const { data } = await userService.getMyInfo();
      setUserInfo(data);
    },
  });

  const handleTransfer = () => {
    if (!selectedTarget) return;
    transferOwner(selectedTarget.lineId);
  };

  const handleCloseModal = () => {
    setIsTransferModalOpen(false);
    setSelectedTarget(null);
    setConfirmText("");
  };

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      transition={pageTransition}
      className="min-h-full flex flex-col gap-5 px-4 pb-[20px]"
    >
      {/* 사용자 정보 영역 */}
      {/* /api/data/usages/balances 로 사용자 정보 받아오기 */}
      {userData && (
        <motion.div
          variants={itemVariants}
          transition={{ ...pageTransition, delay: 0.1 }}
        >
          <UserInfoCard userData={userData} userId={currentUserId} />
        </motion.div>
      )}

      {/* 현재 적용중인 정책 영역 */}
      {appliedPolicies.length > 0 && (
        <motion.div
          variants={itemVariants}
          transition={{ ...pageTransition, delay: 0.2 }}
        >
          <PolicyScroll
            policies={appliedPolicies.map((policy, index) => ({
              id: index + 1,
              ...policy,
            }))}
            title="현재 적용중인 정책"
          />
        </motion.div>
      )}

      {/* 데이터 임계치 설정 영역(가족 공유 데이터 임계치, 개인 데이터 임계치) */}
      {/* 가족 공유 데이터: 대표자만 접근 가능
        /api/shared-pools/limit로 데이터 넘기기
        개인 데이터 임계치 설정: 각자 자신의 것
        /api/lines/thresholds로 데이터 넘기기 */}
      {sharedPoolThreshold && lineThreshold && (
        <motion.div
          variants={itemVariants}
          transition={{ ...pageTransition, delay: 0.3 }}
        >
          <DataThresholdSlider
            isOwner={isOwner}
            sharedPoolThreshold={sharedPoolThreshold}
            lineThreshold={lineThreshold}
          />
        </motion.div>
      )}

      {/* 권한 관리 */}
      {isOwner && (
        <motion.div
          variants={itemVariants}
          transition={{ ...pageTransition, delay: 0.4 }}
        >
          <PermissionManager />
        </motion.div>
      )}

      {/* 구성원별 정책 제어 버튼 */}
      {isOwner && (
        <motion.div
          variants={itemVariants}
          transition={{ ...pageTransition, delay: 0.5 }}
        >
          <button
            onClick={() => navigate("/policy-detail")}
            className="w-full flex items-center gap-4 px-4 py-3 bg-white/60 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <img src={SettingIcon} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-800">
                구성원별 정책 제어
              </span>
              <span className="text-xs text-gray-400">
                데이터 한도, 속도 등을 설정하세요.
              </span>
            </div>
          </button>
        </motion.div>
      )}

      {/* 권한 양도 버튼 */}
      {isOwner && (
        <motion.div
          variants={itemVariants}
          transition={{ ...pageTransition, delay: 0.6 }}
        >
          <button
            onClick={() => setIsTransferModalOpen(true)}
            className="w-full flex items-center gap-4 px-4 py-3 bg-white/60 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="w-12 h-12 rounded-xl bg-lime-100 flex items-center justify-center flex-shrink-0">
              <img src={AssignIcon} />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-800">
                대표자 권한 양도
              </span>
              <span className="text-xs text-gray-400">
                대표자 권한을 양도할 구성원을 고르세요.
              </span>
            </div>
          </button>
        </motion.div>
      )}

      {/* 권한 양도 모달 */}
      {/* createPortal을 사용하면 부모 컴포넌트의 overflow, z-index 영향을 받지 않고 렌더링 가능 */}
      {isTransferModalOpen &&
        createPortal(
          <>
            <div
              className="fixed inset-0 bg-black/40 z-[200]"
              onClick={handleCloseModal}
            />
            <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-[201] bg-white rounded-2xl p-6 max-w-sm mx-auto">
              <h3 className="text-base font-bold text-gray-800 mb-4">
                대표자 권한 양도
              </h3>

              {/* 구성원 선택 */}
              <p className="text-sm text-gray-500 mb-3">
                양도할 구성원을 선택하세요
              </p>
              <div className="flex flex-col gap-2 mb-5">
                {familyMembers
                  .filter((member) => member.lineId !== userData?.lineId)
                  .map((member) => (
                    <button
                      key={member.lineId}
                      onClick={() => setSelectedTarget(member)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${
                        selectedTarget?.lineId === member.lineId
                          ? "border-[#678BF7] bg-blue-50"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >
                      <Avatar
                        userName={member.userName}
                        userId={member.userId}
                        lineIndex={lineIndexMap.get(member.lineId) ?? 0}
                      />{" "}
                      <span className="text-sm font-medium text-gray-800">
                        {member.userName}
                        {familyMembers.filter(
                          (m) => m.userName === member.userName,
                        ).length > 1 && (
                          <span className="text-xs font-normal text-gray-400 ml-1">
                            ({member.phone.slice(-4)})
                          </span>
                        )}
                      </span>
                      {selectedTarget?.lineId === member.lineId && (
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
                    !selectedTarget ||
                    confirmText !== "권한을 양도합니다" ||
                    isPending
                  }
                  className="flex-1 py-3 bg-[#678BF7] text-white rounded-xl text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isPending ? "처리중..." : "양도하기"}
                </button>
              </div>
            </div>
          </>,
          document.body,
        )}
    </motion.div>
  );
}
