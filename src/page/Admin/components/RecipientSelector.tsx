interface Recipient {
  id: string;
  name: string;
  phone: string;
}

interface RecipientSelectorProps {
  recipients: Recipient[];
  onRemove: (id: string) => void;
  onAdd: () => void;
}

export default function RecipientSelector({ recipients, onRemove, onAdd }: RecipientSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-bold mb-3">수신자 검색</label>
      <div className="border border-gray-300 rounded-lg p-4 min-h-[120px]">
        <div className="flex flex-wrap gap-2 mb-3">
          {recipients.map((recipient) => (
            <div
              key={recipient.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full"
            >
              <span className="text-sm font-medium">
                {recipient.name} ({recipient.phone})
              </span>
              <button
                onClick={() => onRemove(recipient.id)}
                className="text-blue-600 hover:text-blue-800"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onAdd}
          className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          휴대폰 번호 또는 유저 이름 검색
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        추가 대상: 데이터 허용량 초과 유저
      </p>
    </div>
  );
}
