import { useState, useRef, useEffect } from "react";
import PolicyScroll from "../../components/common/PolicyScroll";
import ApplicationTab from "./components/ApplicationTab";
import BlockTab from "./components/BlockTab";
import LimitTab from "./components/LimitTab";
import ActiveBlockBanner from "./components/ActiveBlockBanner";
import Avatar from "@/components/common/Avatar";
import { blockService } from "@/api";
import { useAppliedPolicies } from "./hooks/useAppliedPolicies";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToastStore } from "@/store/toastStore";
import { motion } from "framer-motion";
import {
  itemVariants,
  pageTransition,
  pageVariants,
} from "@/utils/pageAnimation";

type TabType = "차단" | "제한" | "애플리케이션";

const PolicyDetail = () => {
  const [selectedLineId, setSelectedLineId] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<TabType>("차단");
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);

  const queryClient = useQueryClient();

  // 사용자 선택 드래그 스크롤 상태
  const userScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const { show } = useToastStore();
  // 음성 인식 타입 정의
  interface SpeechRecognitionResult {
    transcript: string;
  }

  interface SpeechRecognitionResultList {
    [index: number]: SpeechRecognitionResult;
    length: number;
  }

  interface SpeechRecognitionEvent {
    results: {
      [index: number]: SpeechRecognitionResultList;
      length: number;
    };
  }

  interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: (() => void) | null;
    onend: (() => void) | null;
  }

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [activeBlockEndTime, setActiveBlockEndTime] = useState<Date | null>(
    null,
  );

  // handleBlockApply 수정
  const handleBlockApply = (blockEndAt: string) => {
    setActiveBlockEndTime(new Date(blockEndAt));
  };

  const [expandedApps, setExpandedApps] = useState<Set<number>>(new Set());

  // 구성원 목록 조회 (페이지 로드 시 한 번만)
  const { data: familyMembers = [] } = useQuery({
    queryKey: ["familyMembersSimple"],
    queryFn: () =>
      blockService.getFamilyMembersSimple().then((res) => res.data),
  });

  // selectedMember 초기화
  const selectedMember =
    familyMembers.find(
      (m) => m.lineId === (selectedLineId ?? familyMembers[0]?.lineId),
    ) ?? null;

  // 배너에서 차단 해제를 클릭했을 경우
  const handleBlockRelease = async () => {
    if (!selectedMember?.lineId) return;
    await blockService.patchImmediateBlock(selectedMember.lineId, null);
    setActiveBlockEndTime(null);
    queryClient.invalidateQueries({
      queryKey: ["immediateBlock", selectedMember.lineId],
    });
    show("차단이 해제되었습니다.");
  };

  const { appliedPolicies, refetch: refetchAppliedPolicies } =
    useAppliedPolicies(selectedMember?.lineId);

  // 차단 되어 있는가를 확인하기
  const { data: immediateBlockData } = useQuery({
    queryKey: ["immediateBlock", selectedMember?.lineId],
    queryFn: () =>
      blockService
        .getImmediateBlock(selectedMember!.lineId)
        .then((res) => res.data),
    enabled: !!selectedMember?.lineId,
  });

  // immediateBlockData가 바뀔 때 activeBlockEndTime 동기화
  const [prevImmediateBlockData, setPrevImmediateBlockData] =
    useState(immediateBlockData);
  if (immediateBlockData !== prevImmediateBlockData) {
    setPrevImmediateBlockData(immediateBlockData);
    if (
      immediateBlockData?.blockEndAt &&
      new Date(immediateBlockData.blockEndAt) > new Date()
    ) {
      setActiveBlockEndTime(new Date(immediateBlockData.blockEndAt));
    } else {
      setActiveBlockEndTime(null);
    }
  }

  // 음성 인식 초기화
  useEffect(() => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognitionConstructor =
        (
          window as typeof window & {
            SpeechRecognition?: new () => SpeechRecognition;
            webkitSpeechRecognition?: new () => SpeechRecognition;
          }
        ).SpeechRecognition ||
        (
          window as typeof window & {
            SpeechRecognition?: new () => SpeechRecognition;
            webkitSpeechRecognition?: new () => SpeechRecognition;
          }
        ).webkitSpeechRecognition;

      if (SpeechRecognitionConstructor) {
        recognitionRef.current = new SpeechRecognitionConstructor();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = "ko-KR";

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const transcript = event.results[0][0].transcript;
          setSearchQuery(transcript);
          setIsListening(false);
        };

        recognitionRef.current.onerror = () => {
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleVoiceSearch = () => {
    if (!recognitionRef.current) {
      alert("음성 인식을 지원하지 않는 브라우저입니다.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const cancelVoiceSearch = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // 드래그 스크롤 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!userScrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - userScrollRef.current.offsetLeft);
    setScrollLeft(userScrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !userScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - userScrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    userScrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    document.addEventListener("mouseup", handleGlobalMouseUp);
    return () => document.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  return (
    <>
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        transition={pageTransition}
        className="px-4 pb-[20px]"
      >
        <motion.div
          variants={itemVariants}
          transition={{ ...pageTransition, delay: 0.1 }}
          className="mb-6"
        >
          <h3
            className="font-semibold text-[#333333] mb-4"
            style={{ fontSize: "1.125em" }}
          >
            사용자 선택
          </h3>
          {familyMembers.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              구성원 정보를 불러오는 중...
            </div>
          ) : (
            <div
              ref={userScrollRef}
              className="flex gap-4 overflow-x-auto pb-2 pt-1 px-1 scrollbar-hide cursor-grab active:cursor-grabbing"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              style={{ userSelect: "none" }}
            >
              {familyMembers.map((member, index) => (
                <button
                  key={member.lineId}
                  onClick={() => setSelectedLineId(member.lineId)}
                  className="flex flex-col items-center gap-2 flex-shrink-0"
                >
                  <Avatar
                    userName={member.userName}
                    colorIndex={index}
                    size="lg"
                    isSelected={selectedMember?.lineId === member.lineId}
                  />
                  <span
                    className={`text-sm font-medium ${selectedMember?.lineId === member.lineId ? "text-black" : "text-[#818181]"}`}
                  >
                    {member.userName}
                  </span>
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {activeBlockEndTime && (
          <motion.div
            variants={itemVariants}
            transition={{ ...pageTransition, delay: 0.15 }}
          >
            <ActiveBlockBanner
              endTime={activeBlockEndTime}
              onRelease={handleBlockRelease}
            />
          </motion.div>
        )}

        {/* 현재 적용중인 정책 */}
        {appliedPolicies.length > 0 && (
          <motion.div
            variants={itemVariants}
            transition={{ ...pageTransition, delay: 0.2 }}
            className="mb-6"
          >
            <PolicyScroll
              policies={appliedPolicies.map((policy, index) => ({
                id: index + 1,
                type: policy.type,
                bgColor: policy.bgColor,
                title: policy.title,
              }))}
              title="현재 적용중인 정책"
            />
          </motion.div>
        )}

        {/* 탭 메뉴 */}
        <motion.div
          variants={itemVariants}
          transition={{ ...pageTransition, delay: 0.25 }}
          className="mb-4"
        >
          <div
            className="flex relative"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderBottom: "1px solid rgba(129, 129, 129, 0.3)",
            }}
          >
            {(["차단", "제한", "애플리케이션"] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-sm font-medium relative ${activeTab === tab ? "text-black" : "text-[#818181]"}`}
              >
                {tab}
                {activeTab === tab && (
                  <div
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{ backgroundColor: "#818181" }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* 탭 내용 */}
        <motion.div
          variants={itemVariants}
          transition={{ ...pageTransition, delay: 0.3 }}
        >
          {activeTab === "애플리케이션" && (
            <ApplicationTab
              expandedApps={expandedApps}
              setExpandedApps={setExpandedApps}
              isListening={isListening}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleVoiceSearch={handleVoiceSearch}
              cancelVoiceSearch={cancelVoiceSearch}
              selectedLineId={selectedMember?.lineId}
              onPolicyChange={refetchAppliedPolicies}
            />
          )}

          {activeTab === "차단" && (
            <BlockTab
              onBlockApply={handleBlockApply}
              lineId={selectedMember?.lineId}
              onPolicyChange={refetchAppliedPolicies} // ← 추가
            />
          )}
          {activeTab === "제한" && (
            <LimitTab
              lineId={selectedMember?.lineId}
              onPolicyChange={refetchAppliedPolicies} // ← 추가
            />
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default PolicyDetail;
