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
      bgOpacity={0.3}
      borderWidth={1}
      className={className}
    >
      <div className="space-y-4">
        {/* 막대 그래프 */}
        <div className="relative w-full h-4 bg-white/50 rounded-full overflow-hidden shadow-blue-600">
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
                  opacity: 0.8,
                  boxShadow: `0 0 8px ${user.color}50`,
                }}
              />
            );
          })}
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
