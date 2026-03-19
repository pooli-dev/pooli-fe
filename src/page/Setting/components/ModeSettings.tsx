import { useSettingStore } from '../../../store/settingStore';
import InfoTooltip from '../../../components/common/InfoTooltip';
import { LargeTextToggle } from './ModeToggles';

export default function ModeSettings() {
  const largeTextMode = useSettingStore(state => state.largeTextMode);
  const setLargeTextMode = useSettingStore(state => state.setLargeTextMode);

  return (
    <div className="mb-8 px-[34.5px]">
      <div className="flex items-center gap-2 mb-4">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="2" width="7" height="7" rx="1" stroke="#333333" strokeWidth="1.5" />
          <rect x="11" y="2" width="7" height="7" rx="1" stroke="#333333" strokeWidth="1.5" />
          <rect x="2" y="11" width="7" height="7" rx="1" stroke="#333333" strokeWidth="1.5" />
          <rect x="11" y="11" width="7" height="7" rx="1" stroke="#333333" strokeWidth="1.5" />
        </svg>
        <h2 className="font-semibold text-[#333333] text-base">모드 설정</h2>
      </div>

      <div className="bg-white rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <span className="text-[#333333] font-medium text-sm">큰글씨 모드</span>
            <InfoTooltip text="글자 크기가 커지며 좀 더 글자가 잘 보이도록 합니다." />
          </div>
          <LargeTextToggle checked={largeTextMode} onChange={setLargeTextMode} />
        </div>
      </div>
    </div>
  );
}
