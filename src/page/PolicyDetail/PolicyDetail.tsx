import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PolicyScroll from "../../components/common/PolicyScroll";
import StatusBar from "../../components/StatusBar";
import ApplicationTab from "./components/ApplicationTab";
import BlockTab from "./components/BlockTab";
import LimitTab from "./components/LimitTab";
import alarmIcon from "../../assets/icon/alarm-icon.png";
import settingIcon from "../../assets/icon/setting-icon.png";
import {
  familyMembers,
  appliedPolicies,
  appPolicies,
  type FamilyMember,
  type AppPolicy,
} from "../../data/policyDetailDummyData";
import ActiveBlockBanner from "./components/ActiveBlockBanner";

type TabType = "차단" | "제한" | "애플리케이션";

const PolicyDetail = () => {
  const navigate = useNavigate();
  const [selectedMember, setSelectedMember] = useState<FamilyMember>(
    familyMembers[1],
  );
  const [activeTab, setActiveTab] = useState<TabType>("애플리케이션");
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
      {/* 상태바 */}
      <StatusBar />

      {/* 커스텀 헤더 */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[480px] max-w-full flex justify-between items-center px-5 h-20 pt-[env(safe-area-inset-top)] z-[100]">
        <div className="flex items-center w-20">
          <button
            type="button"
            aria-label="뒤로 가기"
            className="p-1 bg-transparent border-none cursor-pointer flex items-center justify-center"
            onClick={() => navigate(-1)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#333333"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <h1
            className="font-semibold text-[#333333] m-0"
            style={{ fontSize: "1.25em" }}
          >
            구성원 별 정책 제어
          </h1>
        </div>

        <div className="flex items-center gap-3 w-20 justify-end">
          <button
            type="button"
            aria-label="알림"
            className="relative cursor-pointer flex items-center justify-center w-12 h-12 rounded-full shrink-0 border-[3px] border-white bg-gradient-to-b from-white/0 to-white/100 to-42%"
            onClick={() => navigate("/alarm")}
          >
            <img src={alarmIcon} alt="" className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-[#FF0000] rounded-full flex items-center justify-center">
              <span className="text-white text-[10px] font-bold leading-none">
                3
              </span>
            </div>
          </button>
          <button
            type="button"
            aria-label="설정"
            className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full shrink-0 border-[3px] border-white bg-gradient-to-b from-white/0 to-white/100 to-42%"
            onClick={() => navigate("/setting")}
          >
            <img src={settingIcon} alt="" className="w-6 h-6" />
          </button>
        </div>
      </header>

      <div className="relative h-[calc(100vh-106px-60px)] overflow-y-auto mt-[106px] mb-[60px]">
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
                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      selectedMember.lineId === member.lineId
                        ? "ring-4 ring-[#678BF7]"
                        : ""
                    }`}
                    style={{
                      backgroundColor:
                        member.lineId === 10
                          ? "#FBC7C3"
                          : member.lineId === 11
                            ? "#CAA6DB"
                            : member.lineId === 12
                              ? "#B6DF82"
                              : "#FFA780",
                    }}
                  >
                    <span className="text-xl text-white font-semibold">
                      {member.userName.charAt(0)}
                    </span>
                  </div>
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
              policies={appliedPolicies.map((policy) => ({
                id: policy.policyId,
                type:
                  policy.policyType === "BLOCK"
                    ? "한도"
                    : policy.policyType === "LIMIT"
                      ? "한도"
                      : "시간",
                bgColor:
                  policy.policyType === "BLOCK"
                    ? "#FFE5E5"
                    : policy.policyType === "LIMIT"
                      ? "#E5F5E5"
                      : "#E5E5FF",
                title: policy.policyName,
              }))}
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
          <div className="-mx-[24px]">
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
