import { calculateDaysUntilNextMonth } from '../utils/formatters';

interface SharedPoolData {
  totalData: number;
  baseData: number;
  contributionData: number;
  usageAmount: number;
  remainingData: number;
}

interface SharedPoolCardProps {
  data?: SharedPoolData;
  error?: Error | null;
}

export default function SharedPoolCard({ data, error }: SharedPoolCardProps) {
  const remainingDays = calculateDaysUntilNextMonth();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" 
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">공유 데이터 풀</h2>
      </div>

      {data ? (
        <div className="space-y-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-sm font-medium text-gray-600">총 공유 데이터</h3>
            <span className="text-xs font-medium text-red-500">D-{remainingDays}</span>
          </div>

          <div className="mb-4">
            <div className="text-3xl font-semibold text-blue-600 mb-2">
              {data.totalData.toFixed(2)} GB
            </div>
            <div className="flex gap-6 text-sm">
              <div>
                <span className="text-gray-400">기본 공유</span>
                <div className="font-medium text-gray-900">
                  {data.baseData.toFixed(2)} GB
                </div>
              </div>
              <div>
                <span className="text-gray-400">가족 추가</span>
                <div className="font-medium text-gray-900">
                  {data.contributionData.toFixed(2)} GB
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 my-4" />

          <div>
            <div className="text-xs text-gray-400 mb-2">현재 사용량</div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{ 
                    width: `${Math.min((data.usageAmount / data.totalData) * 100, 100)}%` 
                  }}
                />
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">
                사용 {data.usageAmount.toFixed(2)}GB / 잔여 {data.remainingData.toFixed(2)}GB
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <svg 
            className="w-12 h-12 mx-auto mb-3 text-orange-300" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
            />
          </svg>
          <p className="text-sm text-gray-500 mb-1">
            공유 데이터 풀 정보를 조회할 수 없습니다
          </p>
          {error && (
            <div className="mt-3 p-3 bg-red-50 rounded-lg text-left max-w-md mx-auto">
              <p className="text-xs text-red-800 font-semibold mb-2">에러 상세:</p>
              <p className="text-xs text-red-700">{error.message || '알 수 없는 오류'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
