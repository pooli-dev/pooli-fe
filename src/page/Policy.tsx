import { useNavigate } from 'react-router-dom';
import { PAGE_PADDING } from '../constants/layout';

/**
 * 정책 페이지 컴포넌트
 * @returns 정책 페이지 JSX
 */
export default function Policy() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: PAGE_PADDING }}>
      <h1>Policy</h1>
      <button
        onClick={() => navigate('/policy-detail')}
        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        구성원 별 정책 제어
      </button>
    </div>
  );
}
