import muneo1 from "@/assets/img/muneo1.png";
import muneo2 from "@/assets/img/muneo2.png";
import muneo3 from "@/assets/img/muneo3.png";
import muneo4 from "@/assets/img/muneo4.png";
import muneo5 from "@/assets/img/muneo5.png";
import muneo6 from "@/assets/img/muneo6.png";
import muneo7 from "@/assets/img/muneo7.png";
import muneo8 from "@/assets/img/muneo8.png";
import muneo9 from "@/assets/img/muneo9.png";
import muneo10 from "@/assets/img/muneo10.png";

export interface SlideData {
  id: number;
  muneoImg: string;
  title: string;
  description: string;
  repOnly?: boolean;
  mockType:
    | "welcome"
    | "main"
    | "members"
    | "detail"
    | "apps"
    | "policy"
    | "notification"
    | "permission"
    | "control"
    | "start";
}

export const SLIDES: SlideData[] = [
  {
    id: 1,
    muneoImg: muneo1,
    title: "안녕하세요!\n무너가 안내해드릴게요",
    description: "가족 공유 데이터를 스마트하게\n관리하는 방법을 알려드려요",
    mockType: "welcome",
  },
  {
    id: 2,
    muneoImg: muneo2,
    title: "공유 데이터 한눈에 확인",
    description: "가족 공유 데이터 잔여량과\n공유풀 현황을 확인해요",
    mockType: "main",
  },
  {
    id: 3,
    muneoImg: muneo3,
    title: "구성원별 데이터 현황",
    description: "가족 구성원 각각의\n데이터 사용량을 확인해요",
    mockType: "members",
  },
  {
    id: 4,
    muneoImg: muneo4,
    title: "사용 추이 상세 분석",
    description: "날짜별 데이터 사용 추이를\n그래프로 한눈에 파악해요",
    mockType: "detail",
  },
  {
    id: 5,
    muneoImg: muneo5,
    title: "앱별 데이터 사용량",
    description: "어떤 앱이 데이터를 많이 쓰는지\n앱별로 확인할 수 있어요",
    mockType: "apps",
  },
  {
    id: 6,
    muneoImg: muneo6,
    title: "임계치 & 사용자 정보",
    description: "데이터 임계치를 설정하고\n사용자 정보를 관리해요",
    mockType: "policy",
  },
  {
    id: 7,
    muneoImg: muneo7,
    title: "알림 · 설정 · 문의",
    description: "중요한 알림을 놓치지 않고\n언제든 문의할 수 있어요",
    mockType: "notification",
  },
  {
    id: 8,
    muneoImg: muneo8,
    title: "권한 설정 & 양도",
    description: "구성원 별로 권한을 설정하고\n대표자 권한을 양도할 수 있어요",
    repOnly: true,
    mockType: "permission",
  },
  {
    id: 9,
    muneoImg: muneo9,
    title: "구성원별 정책 제어",
    description: "구성원의 데이터 사용을\n차단하거나 제한할 수 있어요",
    repOnly: true,
    mockType: "control",
  },
  {
    id: 10,
    muneoImg: muneo10,
    title: "이제 시작해볼까요?",
    description: "무너와 함께 가족 데이터를\n스마트하게 관리해보세요",
    mockType: "start",
  },
];

export const getSlides = (isRepresentative: boolean): SlideData[] =>
  SLIDES.filter((s) => !s.repOnly || isRepresentative);
