import { useState, useEffect } from 'react';
import BlockPolicyManager from './BlockPolicyManager';
import ImmediateBlockPolicy from '@/page/PolicyDetail/components/Immediateblockpolicy';
import { blockService } from '@/api';
import { getErrorMessage } from '@/api/client';

export default function BlockPolicyTab({ 
  lineId, 
  onPolicyChange 
}: { 
  lineId: number;
  onPolicyChange?: () => void;
}) {
  const [immediateBlockEnabled, setImmediateBlockEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadImmediateBlockStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lineId]);

  const loadImmediateBlockStatus = async () => {
    setLoading(true);
    try {
      const res = await blockService.getImmediateBlock(lineId);
      if (res.data && res.data.blockEndAt) {
        const endTime = new Date(res.data.blockEndAt);
        const now = new Date();
        setImmediateBlockEnabled(endTime > now);
      } else {
        setImmediateBlockEnabled(false);
      }
    } catch (err) {
      console.error('즉시 차단 상태 조회 실패:', err);
      setImmediateBlockEnabled(false);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockApply = async (minutes: number) => {
    try {
      const endAt = new Date(Date.now() + minutes * 60 * 1000).toISOString();
      console.log('즉시 차단 적용:', { lineId, blockEndAt: endAt, minutes });
      await blockService.updateImmediateBlock(lineId, endAt);
      console.log('즉시 차단 적용 성공');
      setImmediateBlockEnabled(true);
      onPolicyChange?.();
    } catch (err) {
      console.error('즉시 차단 적용 실패:', err);
      alert(getErrorMessage(err));
    }
  };

  const handleBlockToggle = async (enabled: boolean) => {
    try {
      if (enabled) {
        // 기본 1시간으로 활성화
        const endAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
        console.log('즉시 차단 활성화:', { lineId, blockEndAt: endAt });
        await blockService.updateImmediateBlock(lineId, endAt);
        console.log('즉시 차단 활성화 성공');
      } else {
        // 차단 해제
        const pastTime = new Date(Date.now() - 1000).toISOString();
        console.log('즉시 차단 해제:', { lineId, blockEndAt: pastTime });
        await blockService.updateImmediateBlock(lineId, pastTime);
        console.log('즉시 차단 해제 성공');
      }
      setImmediateBlockEnabled(enabled);
      onPolicyChange?.();
    } catch (err) {
      console.error('즉시 차단 토글 실패:', err);
      alert(getErrorMessage(err));
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-3 px-4 py-4">
        <div className="text-center py-4 text-gray-400">불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 px-4 py-4">
      <BlockPolicyManager lineId={lineId} onPolicyChange={onPolicyChange} />
      <ImmediateBlockPolicy 
        initialEnabled={immediateBlockEnabled}
        onDurationChange={handleBlockApply}
        onToggle={handleBlockToggle}
      />
    </div>
  );
}
