import { useState } from 'react';
import AdminHeader from './components/AdminHeader';
import ConfirmModal from '@/components/common/ConfirmModal';
import { notificationService } from '@/api';
import type { SendNotificationRequest, NotificationTargetType } from '@/api/services/notificationService';
import { getErrorMessage } from '@/api/client';

const TARGET_OPTIONS: { 
  key: NotificationTargetType; 
  label: string; 
  desc: string; 
  color: string; 
  icon: string;
  requiresLineId: boolean;
}[] = [
  { 
    key: 'DIRECT', 
    label: '특정 회선', 
    desc: 'Line ID 직접 지정', 
    color: 'blue', 
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
    requiresLineId: true
  },
  { 
    key: 'ALL', 
    label: '전체 회선', 
    desc: '모든 유저', 
    color: 'purple', 
    icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    requiresLineId: false
  },
  { 
    key: 'OWNER', 
    label: 'OWNER 역할', 
    desc: '가족 대표자', 
    color: 'green', 
    icon: 'M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    requiresLineId: false
  },
  { 
    key: 'MEMBER', 
    label: 'MEMBER 역할', 
    desc: '일반 구성원', 
    color: 'orange', 
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
    requiresLineId: false
  },
];

const COLOR_MAP: Record<string, { border: string; bg: string; text: string }> = {
  blue: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
  purple: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-600' },
  green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-600' },
  orange: { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-600' },
};

export default function NotificationManagement() {
  const [targetType, setTargetType] = useState<NotificationTargetType>('ALL');
  const [lineIdInput, setLineIdInput] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean; message: string; onConfirm: () => void;
  }>({ open: false, message: '', onConfirm: () => {} });

  const selectedOption = TARGET_OPTIONS.find(t => t.key === targetType);
  const requiresLineId = selectedOption?.requiresLineId ?? false;

  const parseLineIds = (): number[] => {
    if (!lineIdInput.trim()) return [];
    return lineIdInput
      .split(/[,\s]+/)
      .map(s => Number(s.trim()))
      .filter(n => !isNaN(n) && n > 0);
  };

  const validateInput = (): string | null => {
    const lineIds = parseLineIds();
    
    if (requiresLineId && lineIds.length === 0) {
      return 'DIRECT 타입은 Line ID를 1개 이상 입력해야 합니다.';
    }
    
    if (!requiresLineId && lineIds.length > 0) {
      return `${selectedOption?.label} 타입은 Line ID를 입력하지 않아야 합니다.`;
    }
    
    return null;
  };

  const buildPayload = (lineIds: number[]): SendNotificationRequest => {
    const payload: SendNotificationRequest = {
      targetType,
      value: { message: messageInput || '알림 메시지' },
    };
    
    if (requiresLineId) {
      payload.lineId = lineIds;
    }
    
    return payload;
  };

  const handleSend = () => {
    const validationError = validateInput();
    if (validationError) {
      setResult({ type: 'error', message: validationError });
      return;
    }

    const lineIds = parseLineIds();
    const isLargeScale = !requiresLineId || lineIds.length > 100;
    const targetDesc = requiresLineId ? `${lineIds.length}개 회선` : selectedOption?.label;
    
    const warningMessage = isLargeScale 
      ? `${targetDesc}에 알림을 전송하시겠습니까?<br/><br/><span style="color: #F59E0B; font-size: 0.875rem;">⚠️ 대량 전송은 시간이 소요될 수 있습니다.<br/>전송 요청 후 백그라운드에서 처리됩니다.</span>`
      : `${targetDesc}에 알림을 전송하시겠습니까?`;

    setConfirmModal({
      open: true,
      message: warningMessage,
      onConfirm: async () => {
        setConfirmModal(prev => ({ ...prev, open: false }));
        setIsSending(true);
        setResult(null);
        
        try {
          const payload = buildPayload(lineIds);
          
          await notificationService.send(payload);
          
          const successMessage = isLargeScale
            ? '알림 전송 요청이 접수되었습니다. 백그라운드에서 처리 중입니다.'
            : '알림이 성공적으로 전송되었습니다.';
          
          setResult({ type: 'success', message: successMessage });
          setLineIdInput('');
          setMessageInput('');
        } catch (err) {
          setResult({ type: 'error', message: getErrorMessage(err) });
        } finally {
          setIsSending(false);
        }
      },
    });
  };

  return (
    <div className="p-8">
      <AdminHeader title="알림 전송" description="유저에게 알림을 전송합니다." />

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          {/* 수신자 유형 선택 */}
          <div>
            <label className="block text-sm font-bold mb-4">수신자 유형</label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {TARGET_OPTIONS.map(opt => {
                const c = COLOR_MAP[opt.color];
                const selected = targetType === opt.key;
                return (
                  <button 
                    key={opt.key} 
                    onClick={() => setTargetType(opt.key)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selected 
                        ? `${c.border} ${c.bg} shadow-md` 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-3">
                      <svg className={`w-10 h-10 ${selected ? c.text : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={opt.icon} />
                      </svg>
                    </div>
                    <div className={`font-bold text-lg ${selected ? 'text-gray-900' : 'text-gray-600'}`}>
                      {opt.label}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Line ID 입력 (DIRECT일 때만) */}
          {requiresLineId && (
            <div>
              <label className="block text-sm font-bold mb-2">Line ID 목록 (필수)</label>
              <textarea
                value={lineIdInput}
                onChange={e => setLineIdInput(e.target.value)}
                placeholder="예: 1, 2, 3 또는 줄바꿈으로 구분"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none text-sm"
                rows={3}
              />
              <p className="text-xs text-gray-400 mt-1">
                쉼표, 공백, 줄바꿈으로 구분하여 입력하세요.
                {lineIdInput.trim() && ` (${parseLineIds().length}개 인식됨)`}
              </p>
            </div>
          )}

          {/* 알림 메시지 */}
          <div>
            <label className="block text-sm font-bold mb-2">알림 메시지 (선택)</label>
            <textarea
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              placeholder="알림 내용을 입력하세요 (비워두면 기본 메시지 전송)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium resize-none text-sm"
              rows={3}
            />
          </div>

          {/* 결과 메시지 */}
          {result && (
            <div className={`p-4 rounded-lg text-sm ${
              result.type === 'success' 
                ? 'bg-green-50 text-green-700' 
                : 'bg-red-50 text-red-600'
            }`}>
              {result.message}
            </div>
          )}

          {/* 전송 버튼 */}
          <button 
            onClick={handleSend} 
            disabled={isSending}
            className="w-full px-4 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {isSending ? '전송 중...' : '전송하기'}
          </button>
        </div>
      </div>

      <ConfirmModal 
        isOpen={confirmModal.open} 
        onClose={() => setConfirmModal(prev => ({ ...prev, open: false }))}
        onConfirm={confirmModal.onConfirm} 
        message={confirmModal.message} 
      />
    </div>
  );
}
