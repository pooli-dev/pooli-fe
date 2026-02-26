import { PAGE_PADDING } from '../constants/layout';

/**
 * 홈 페이지 컴포넌트
 * @returns 홈 페이지 JSX
 */
export default function Home() {
  return (
    <div className="relative h-[calc(100vh-106px-60px)] overflow-y-auto mt-[106px] mb-[60px]">
      <div style={{ padding: PAGE_PADDING }} className="pb-[60px]">
        <h2>Home Page</h2>
        <p>POOLI 프론트 프로젝트 시작 🎉</p>
      </div>
    </div>
  );
}
