import GlassCard from "./GlassCard";

type UserData = {
  name: string;
  percentage: number;
  color: string;
};

type Props = {
  users?: UserData[];
  className?: string;
};

export default function SharedPoolUsage({
  users = [
    { name: "김영희", percentage: 10, color: "#B6DF82" },
    { name: "김철수", percentage: 15, color: "#57CAFB" },
    { name: "김옥자", percentage: 30, color: "#FAC0B5" },
    { name: "김민우", percentage: 15, color: "#CAA6DB" },
  ],
  className = "",
}: Props) {
  return (
    <GlassCard
      title="공유풀 사용량"
      gradientFrom="#FFFFFF"
      gradientTo="#CCCCCC"
      bgGradientFrom="#FFFFFF"
      bgGradientTo="#F8F8F8"
      bgOpacity={0.7}
      borderWidth={1}
      className={className}
    >
      <div className="space-y-4">
        {/* 막대 그래프 */}
        <div className="relative w-full my-3">
          {/* 글로우 레이어 - 흰색 막대의 파란 네온 */}
          <div
            className="absolute w-full h-4 rounded-full"
            style={{
              backgroundColor: "#FFFFFF",
              filter: "blur(6px)",
              opacity: 0.9,
              transform: "scaleY(0.5)",
              boxShadow: "0 0 12px 4px #93C5FD",
            }}
          />

          {/* 실제 흰색 막대 (유저 세그먼트 포함) */}
          <div
            className="relative w-full h-4 rounded-full overflow-hidden"
            style={{ backgroundColor: "#F0F5FF" }}
          >
            {users.map((user, index) => {
              const leftOffset = users
                .slice(0, index)
                .reduce((sum, u) => sum + u.percentage, 0);
              return (
                <div
                  key={user.name}
                  className="absolute top-0 h-full transition-all duration-500 ease-out"
                  style={{
                    left: `${leftOffset}%`,
                    width: `${user.percentage}%`,
                    backgroundColor: user.color,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* 사용자 정보 */}
        <div className="grid grid-cols-2 gap-3">
          {users.map((user) => (
            <div key={user.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: user.color,
                  boxShadow: `0 0 6px ${user.color}60`,
                }}
              />
              <span className="text-xs text-gray-700 font-light">
                {user.name} {user.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
