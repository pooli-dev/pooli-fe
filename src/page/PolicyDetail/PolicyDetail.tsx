import { useState, useRef, useEffect } from "react";
import PolicyScroll from "../../components/common/PolicyScroll";
import ApplicationTab from "./components/ApplicationTab";
import BlockTab from "./components/BlockTab";
import LimitTab from "./components/LimitTab";
import ActiveBlockBanner from "./components/ActiveBlockBanner";
import Avatar from "@/components/common/Avatar";
import { blockService } from "@/api";
import { useUserStore } from "@/store/userStore";
import { useAppliedPolicies } from "./hooks/useAppliedPolicies";

type FamilyMember = {
  lineId: number;
  userId: number;
  userName: string;
  phone: string;
};

type TabType = "차단" | "제한" | "애플리케이션";

const PolicyDetail = () => {
  const lineId = useUserStore((state) => state.userInfo?.lineId);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(
    null,
  );
  const [activeTab, setActiveTab] = useState<TabType>("차단");
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  
  // 사용자 선택 드래그 스크롤 상태
  const userScrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
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
  
  const { appliedPolicies, refetch: refetchAppliedPolicies } = useAppliedPolicies(selectedMember?.lineId);

  const handleBlockApply = (minutes: number) => {
    const end = new Date();
    end.setMinutes(end.getMinutes() + minutes);
    setActiveBlockEndTime(end);
  };

  const [expandedApps, setExpandedApps] = useState<Set<number>>(new Set());

  // 구성원 목록 조회 (페이지 로드 시 한 번만)
  useEffect(() => {
    blockService
      .getFamilyMembersSimple()
      .then((res) => {
        console.log("백엔드 /families/members-simple 응답:", res.data);
        setFamilyMembers(res.data);
        if (res.data.length > 0) {
          // 로그인한 사용자의 lineId와 일치하는 구성원을 기본 선택
          const currentUser = res.data.find((m) => m.lineId === lineId);
          const selected = currentUser || res.data[0];
          setSelectedMember(selected);
        }
      })
      .catch((error) => {
        console.error("구성원 목록 조회 실패:", error);
        // 에러 발생 시 더미 데이터 사용 (개발 중)
        const dummyMembers = [
          {
            lineId: 10,
            userId: 3,
            userName: "홍길동",
            phone: "01012345678",
          },
          {
            lineId: 11,
            userId: 4,
            userName: "김철수",
            phone: "01023456789",
          },
        ];
        setFamilyMembers(dummyMembers);
        setSelectedMember(dummyMembers[0]);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // lineId 의존성 제거 - 페이지 로드 시 한 번만 실행

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
      <div className="relative h-[calc(100dvh-106px-60px)] overflow-y-auto mt-[106px] mb-[60px]">
        <div className="px-[24px] py-5 pb-[60px]">
          {/* 사용자 선택 */}
          <div className="mb-6">
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
                    onClick={() => setSelectedMember(member)}
                    className="flex flex-col items-center gap-2 flex-shrink-0"
                  >
                    <Avatar
                      userName={member.userName}
                      colorIndex={index}
                      size="lg"
                      isSelected={selectedMember?.lineId === member.lineId}
                    />
                    <span
                      className={`text-sm font-medium ${
                        selectedMember?.lineId === member.lineId
                          ? "text-black"
                          : "text-[#818181]"
                      }`}
                    >
                      {member.userName}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {activeBlockEndTime && (
            <ActiveBlockBanner
              endTime={activeBlockEndTime}
              onRelease={() => setActiveBlockEndTime(null)}
            />
          )}

          {/* 현재 적용중인 정책 */}
          {appliedPolicies.length > 0 && (
            <div className="mb-6">
              <PolicyScroll
                policies={appliedPolicies.map((policy, index) => ({
                  id: index + 1,
                  type: policy.type,
                  bgColor: policy.bgColor,
                  title: policy.title,
                }))}
                title="현재 적용중인 정책"
              />
            </div>
          )}

          {/* 탭 메뉴 */}
          <div className="mb-4">
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
                  className={`flex-1 py-2 text-sm font-medium relative ${
                    activeTab === tab ? "text-black" : "text-[#818181]"
                  }`}
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
          </div>

          {/* 탭 내용 */}
          <div>
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
              />
            )}
            {activeTab === "제한" && <LimitTab />}
          </div>
        </div>
      </div>
    </>
  );
};

export default PolicyDetail;
