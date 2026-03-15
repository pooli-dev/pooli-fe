import GlassCard from "../../../components/common/GlassCard";

type UserData = {
  name: string;
  percentage: number;
  color: string;
};

type Props = {
  users?: UserData[];
  className?: string;
};

export default function SharedPoolUsage({ users = [], className = "" }: Props) {
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
          {/* 실제 흰색 막대 */}
          <div
            className="relative w-full h-4 rounded-full overflow-hidden"
            style={{
              backgroundColor: "#F0F5FF",
              boxShadow:
                "inset 0 2px 4px rgba(0,0,0,0.08), inset 0 1px 2px rgba(0,0,0,0.05)",
            }}
          >
            {users.map((user, index) => {
              const leftOffset = Math.min(
                users.slice(0, index).reduce((sum, u) => sum + u.percentage, 0),
                100,
              );
              return (
                <div
                  key={user.name}
                  className="absolute top-0 h-full transition-all duration-500 ease-out"
                  style={{
                    left: `${leftOffset}%`,
                    width: `${Math.min(user.percentage, 100 - leftOffset)}%`,
                    backgroundColor: user.color,
                    boxShadow:
                      "inset 0 2px 4px rgba(0,0,0,0.08), inset 0 1px 2px rgba(0,0,0,0.05)",
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
