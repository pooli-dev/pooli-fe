import { useSettingStore } from '../../../store/settingStore';
import InfoTooltip from '../../../components/common/InfoTooltip';
import { DarkModeToggle, LargeTextToggle, ChildModeToggle } from './ModeToggles';

export default function ModeSettings() {
  const darkMode = useSettingStore(state => state.darkMode);
  const largeTextMode = useSettingStore(state => state.largeTextMode);
  const childMode = useSettingStore(state => state.childMode);
  const setDarkMode = useSettingStore(state => state.setDarkMode);
  const setLargeTextMode = useSettingStore(state => state.setLargeTextMode);
  const setChildMode = useSettingStore(state => state.setChildMode);

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
            <span className="text-[#333333] font-medium text-sm">다크 모드</span>
            <InfoTooltip text="화면 밝기 다크 모드를 바꿀 수 있습니다." />
          </div>
          <DarkModeToggle checked={darkMode} onChange={setDarkMode} />
        </div>

        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <span className="text-[#333333] font-medium text-sm">큰글씨 모드</span>
            <InfoTooltip text="글자 크기가 커지며 좀 더 글자가 잘 보이도록 합니다." />
          </div>
          <LargeTextToggle checked={largeTextMode} onChange={setLargeTextMode} />
        </div>

        <div className="flex items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <span className="text-[#333333] font-medium text-sm">어린이 모드</span>
            <InfoTooltip text="이해가 어려운 데이터 관련 용어들을 쉬운 언어로 번역합니다." />
          </div>
          <ChildModeToggle checked={childMode} onChange={setChildMode} />
        </div>
      </div>
    </div>
  );
}
