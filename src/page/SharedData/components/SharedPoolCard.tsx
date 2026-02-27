import { useNavigate } from 'react-router-dom';

interface SharedPoolCardProps {
  totalData: number; // MB
  remainingData: number; // MB
  baseData: number; // MB
  contributionData: number; // MB
  usageAmount: number; // MB
  remainingDays: number;
}

export default function SharedPoolCard({
  totalData,
  remainingData,
  baseData,
  contributionData,
  usageAmount,
  remainingDays
}: SharedPoolCardProps) {
  const navigate = useNavigate();
  
  const totalGB = (totalData / 1000).toFixed(1);
  const baseGB = (baseData / 1000).toFixed(1);
  const contributionGB = (contributionData / 1000).toFixed(1);
  const usageGB = (usageAmount / 1000).toFixed(1);
  const usagePercent = (usageAmount / totalData) * 100;

  return (
    <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
      <div className="flex justify-between items-start mb-1">
        <h2 className="text-[15px] font-medium" style={{ color: '#808692' }}>총 공유 데이터</h2>
        <span className="text-xs font-medium mr-2 mt-1" style={{ color: '#BA7E7D' }}>
          잔여 기간 {remainingDays}일
        </span>
      </div>
      
      <div className="mb-2 mt-3">
        <div className="flex justify-between items-center mb-2">
          <div className="text-[30px] font-semibold" style={{ color: '#678BF7' }}>
            {totalGB} GB
          </div>
          <button 
            onClick={() => navigate('/shared-data/usage')}
            className="px-6 py-2.5 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 relative overflow-hidden"
            style={{
              background: 'rgba(103, 139, 247, 0.6)'
            }}
          >
            {/* 그라데이션 외곽선 */}
            <div 
              className="absolute inset-0 rounded-lg"
              style={{
                padding: '1.5px',
                background: 'linear-gradient(to right, rgba(255, 255, 255, 0.6), #678BF7)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude'
              }}
            />
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
              <path d="M9 11l3 3L22 4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="relative z-10">사용 로그 보기</span>
          </button>
        </div>
        <div className="flex gap-8 text-sm">
          <div>
            <span style={{ color: '#9CA3AF' }}>기본 공유</span>
            <div className="font-medium text-base" style={{ color: '#374151' }}>{baseGB} GB</div>
          </div>
          <div>
            <span style={{ color: '#9CA3AF' }}>가족 추가</span>
            <div className="font-medium text-base" style={{ color: '#374151' }}>{contributionGB} GB</div>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="mx-4 mb-3 border-t" style={{ borderColor: '#F3F4F6' }} />

      <div className="mb-2">
        <div className="text-xs mb-2" style={{ color: '#9CA3AF' }}>
          <span>현재 사용량</span>
        </div>
        <div className="flex items-center gap-3 text-xs" style={{ color: '#9CA3AF' }}>
          <div className="flex-1 h-3 rounded-full bg-gray-100 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500"
              style={{ 
                width: `${usagePercent}%`,
                background: 'linear-gradient(to right, #678BF7, #9A9CEA)'
              }}
            />
          </div>
          <span className="whitespace-nowrap">사용 {usageGB}GB / 잔여 {(remainingData / 1000).toFixed(1)}GB</span>
        </div>
      </div>
    </div>
  );
}
