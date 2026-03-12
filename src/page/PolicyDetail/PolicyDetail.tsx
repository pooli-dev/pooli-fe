import { useState, useRef, useEffect } from "react";
import PolicyScroll from "../../components/common/PolicyScroll";
import ApplicationTab from "./components/ApplicationTab";
import BlockTab from "./components/BlockTab";
import LimitTab from "./components/LimitTab";
import {
  familyMembers,
  appPolicies,
  type FamilyMember,
  type AppPolicy,
} from "../../data/policyDetailDummyData";
import ActiveBlockBanner from "./components/ActiveBlockBanner";
import Avatar from "@/components/common/Avatar";

type TabType = "차단" | "제한" | "애플리케이션";

const PolicyDetail = () => {
  const [selectedMember, setSelectedMember] = useState<FamilyMember>(
    familyMembers[1],
  );
  const [activeTab, setActiveTab] = useState<TabType>("차단");
  const [searchQuery, setSearchQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
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

  const handleBlockApply = (minutes: number) => {
    const end = new Date();
    end.setMinutes(end.getMinutes() + minutes);
    setActiveBlockEndTime(end);
  };

  // 앱 정책 상태 관리
  const [appPolicyStates, setAppPolicyStates] =
    useState<AppPolicy[]>(appPolicies);
  const [expandedApps, setExpandedApps] = useState<Set<number>>(new Set());

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
            <div className="flex gap-4 overflow-x-auto pb-2 pt-1 px-1">
              {familyMembers.map((member) => (
                <button
                  key={member.lineId}
                  onClick={() => setSelectedMember(member)}
                  className="flex flex-col items-center gap-2 flex-shrink-0"
                >
                  <Avatar
                    userName={member.userName}
                    colorIndex={member.lineId}
                    size="lg"
                    isSelected={selectedMember.lineId === member.lineId}
                  />
                  <span
                    className={`text-sm font-medium ${
                      selectedMember.lineId === member.lineId
                        ? "text-black"
                        : "text-[#818181]"
                    }`}
                  >
                    {member.userName}
                  </span>
                </button>
              ))}
            </div>
          </div>
          {activeBlockEndTime && (
            <ActiveBlockBanner
              endTime={activeBlockEndTime}
              onRelease={() => setActiveBlockEndTime(null)}
            />
          )}

          {/* 현재 적용중인 정책 */}
          <div className="mb-6">
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
          </div>

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
                appPolicyStates={appPolicyStates}
                setAppPolicyStates={setAppPolicyStates}
                expandedApps={expandedApps}
                setExpandedApps={setExpandedApps}
                isListening={isListening}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleVoiceSearch={handleVoiceSearch}
                cancelVoiceSearch={cancelVoiceSearch}
              />
            )}

            {activeTab === "차단" && (
              <BlockTab onBlockApply={handleBlockApply} />
            )}
            {activeTab === "제한" && <LimitTab />}
          </div>
        </div>
      </div>
    </>
  );
};

export default PolicyDetail;
