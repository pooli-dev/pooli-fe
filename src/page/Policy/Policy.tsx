import { useNavigate } from "react-router-dom";
import PolicyPageHeader from "./components/UserInfo";
import PolicyScroll from "@/components/common/PolicyScroll";
import DataThresholdSlider from "./components/DataThresholdSlider";
import PermissionManager from "./components/Permisssion";

/**
 * 정책 페이지 컴포넌트
 * @returns 정책 페이지 JSX
 */
export default function Policy() {
  const navigate = useNavigate();

  return (
    <div className="relative h-[calc(100vh-106px-60px)] overflow-y-auto mt-[106px] mb-[60px]">
      <div className="min-h-full flex flex-col gap-5 px-6 pb-[60px]">
        <PolicyPageHeader
          userName="김영희"
          isOwner={true}
          planName="5G 라이트"
          isDualPhone={true}
          sharedDataRemaining={2500}
          personalDataRemaining={2500}
          isBlocked={false}
          onAccountSwitch={() => {}}
          onBlockToggle={() => {}}
          onAddSharedData={() => navigate("/shared-pool/add")}
          onViewLog={() => navigate("/log")}
        />
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
        <DataThresholdSlider
          initialEnabled={true}
          initialValue={20}
          min={1}
          max={100}
        />
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
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          구성원 별 정책 제어
        </button>
      </div>
    </div>
  );
}
