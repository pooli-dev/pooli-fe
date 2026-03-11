// components/common/Avatar.tsx

const AVATAR_COLORS = ["#FBC7C3", "#CAA6DB", "#B6DF82", "#FFA780"];

type Props = {
  userName: string;
  colorIndex?: number;
  size?: "md" | "lg"; // md=w-14(단일), lg=w-16(여러개)
  isOwner?: boolean; // 왕관
  isSelected?: boolean; // 선택 링 (여러개일 때만)
};

export default function Avatar({
  userName,
  colorIndex = 1,
  size = "md",
  isOwner = false,
  isSelected = false,
}: Props) {
  const sizeClass = size === "md" ? "w-14 h-14" : "w-16 h-16";
  const bgColor = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];

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
