interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

/**
 * 공용 확인 모달 컴포넌트
 * @param isOpen - 모달 표시 여부
 * @param onClose - 취소 버튼 클릭 핸들러
 * @param onConfirm - 확인 버튼 클릭 핸들러
 * @param message - 모달에 표시할 메시지 (줄바꿈은 <br />로 표현)
 * @param confirmText - 확인 버튼 텍스트 (기본값: "예")
 * @param cancelText - 취소 버튼 텍스트 (기본값: "아니요")
 */
export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = "예",
  cancelText = "아니요",
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200]">
      <div className="bg-white rounded-2xl p-6 mx-4 max-w-sm w-full">
        <p
          className="text-center text-[#333333] mb-6 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: message }}
        />
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-[#E0E0E0] text-[#666666] rounded-lg font-medium"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-[#678BF7] text-white rounded-lg font-medium"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
