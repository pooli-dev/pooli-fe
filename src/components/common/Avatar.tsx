// components/common/Avatar.tsx

const BASE_COLORS = [
  "#B6DF82", // 초록
  "#FBC7C3", // 분홍
  "#CAA6DB", // 보라
  "#FFA780", // 주황
  "#57CAFB", // 하늘
  "#FFD580", // 노랑
  "#A0C4FF", // 파랑
  "#F9A8D4", // 핫핑크
];

const DARKEN: Record<number, string> = {
  0: "FF",
  1: "55",
};

type Props = {
  userName: string;
  userId?: number; // 유저 구분 (없으면 colorIndex fallback)
  lineIndex?: number; // 같은 유저 내 회선 순서 (0 = 첫번째)
  colorIndex?: number; // 기존 호환용 fallback
  size?: "md" | "lg"; // md=w-14(단일), lg=w-16(여러개)
  isOwner?: boolean; // 왕관
  isSelected?: boolean; // 선택 링 (여러개일 때만)
};

export default function Avatar({
  userName,
  userId,
  lineIndex = 0,
  colorIndex = 0,
  size = "md",
  isOwner = false,
  isSelected = false,
}: Props) {
  const sizeClass = size === "md" ? "w-14 h-14" : "w-16 h-16";

  // userId가 있으면 userId 기반, 없으면 기존 colorIndex fallback
  const baseIndex = userId !== undefined ? userId : colorIndex;
  const baseColor = BASE_COLORS[baseIndex % BASE_COLORS.length];
  const opacity = DARKEN[lineIndex] ?? "BB";
  const bgColor = `${baseColor}${opacity}`;

  return (
    <div className="relative flex-shrink-0">
      <div
        className={`${sizeClass} rounded-full flex items-center justify-center ${
          isSelected ? "ring-4 ring-[#678BF7]" : ""
        }`}
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-xl text-white font-semibold">
          {userName.charAt(0)}
        </span>
      </div>
      {isOwner && (
        <div className="absolute -bottom-1 right-1 text-base leading-none">
          👑
        </div>
      )}
    </div>
  );
}
