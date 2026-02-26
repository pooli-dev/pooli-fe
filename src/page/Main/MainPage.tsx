import CircleProgress from "../Main/components/PieChart";
import DataBlockBanner from "./components/GlassCard";
import SharedPoolUsage from "./components/SharedPoolUsage";
import BlockIcon from "../../assets/icon/block.svg";
import PlusIcon from "../../assets/icon/plus.svg";
import GradientButton from "./components/GradientButton";
import { useNavigate } from "react-router-dom";
import FamilyMemberList, {
  type FamilyMember,
} from "./components/Familymemberlist";

export default function Main() {
  const navigate = useNavigate();
  const members: FamilyMember[] = [
    {
      id: "1",
      name: "김영희",
      isRepresentative: true,
      isMe: true,
      basicDataRemaining: 0,
      basicDataTotal: 5000, // 5GB
      sharedDataRemaining: 1600, // 1.6GB
      sharedDataTotal: 2000, // 2GB
    },
    {
      id: "2",
      name: "김철수",
      basicDataRemaining: 1600,
      basicDataTotal: 2000,
      sharedDataRemaining: 0,
      sharedDataTotal: 2000,
    },
  ];

  return (
    // 전체 영역
    <div className="min-h-dvh flex flex-col items-center justify-center gap-5 px-6 pb-24">
      {/* 데이터 차단 활성화 배너 영역 */}
      <div className="w-full max-w-md">
        <DataBlockBanner
          title=""
          gradientFrom="#FFFFFF"
          gradientTo="#999999"
          bgGradientFrom="#FFFFFF"
          bgGradientTo="#EEEEEE"
          bgOpacity={0.2}
          borderWidth={2}
        >
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center rounded-full bg-[#E4E9FC]">
              <img src={BlockIcon} alt="" className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              {/* 제목 */}
              <h3 className="text-base font-semibold text-gray-800 mb-0.5">
                데이터 차단 활성화
              </h3>

              {/* 내용 */}
              <p className="text-sm text-gray-500 font-light">
                현재 차단 시간 | 월요일 10시 ~ 화요일 06시
              </p>
            </div>
          </div>
        </DataBlockBanner>
      </div>

      {/* 그래프 영역 */}
      <div className="flex flex-col items-center gap-4">
        <CircleProgress value={65} />
      </div>

      {/* 공유 데이터 담기 페이지 이동 버튼 */}
      <GradientButton onClick={() => navigate("/shared-pool/add")}>
        <img src={PlusIcon} className="w-5 h-5" />
        가족 공유 데이터 담기
      </GradientButton>

      {/* 공유풀 사용량 */}
      <div className="w-full max-w-md">
        <SharedPoolUsage />
      </div>

      <FamilyMemberList members={members} />
    </div>
  );
}
