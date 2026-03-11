import { useState } from 'react';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { questionService, getCategoryDisplayName, type QuestionCategory } from '../../../api/services/questionService';

interface InquiryFormProps {
  categories: QuestionCategory[];
  onSubmitSuccess: () => void;
}

export default function InquiryForm({ categories, onSubmitSuccess }: InquiryFormProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    categories.length > 0 ? categories[0].questionCategoryId : 1
  );
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [titleError, setTitleError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 3 - images.length);
      setImages([...images, ...newImages]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const isTitleValid = title.trim().length > 0;
    const isContentValid = content.trim().length >= 10;
    
    setTitleError(!isTitleValid);
    setContentError(!isContentValid);
    
    if (!isTitleValid) {
      setValidationMessage('제목을 입력해주세요');
      return;
    }
    
    if (!isContentValid) {
      setValidationMessage('문의내용은 최소 10자 이상 500자 이하여야 합니다');
      return;
    }
    
    setValidationMessage('');
    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setIsLoading(true);
      
      let uploadedAttachments: { s3Key: string; fileSize: number }[] = [];

      if (images.length > 0) {
        try {
          const presignedUrlRequest = {
            files: images.map(img => ({
              fileName: img.name,
              contentType: img.type,
            })),
            domain: 'QUESTION' as const,
          };

          const presignedResponse = await questionService.getPresignedUrls(presignedUrlRequest);

          if (!presignedResponse?.uploads || presignedResponse.uploads.length === 0) {
            throw new Error('Presigned URL 발급 실패');
          }

          await Promise.all(
            presignedResponse.uploads.map(async (urlInfo, index) => {
              await questionService.uploadToS3(urlInfo.uploadUrl, images[index]);
            })
          );

          uploadedAttachments = presignedResponse.uploads.map((urlInfo, index) => ({
            s3Key: urlInfo.s3Key,
            fileSize: images[index].size,
          }));
        } catch (uploadError: unknown) {
          console.error('이미지 업로드 실패:', uploadError);
          
          if (uploadError instanceof Error && (uploadError.message === 'Failed to fetch' || uploadError.name === 'TypeError')) {
            const confirmWithoutImage = window.confirm(
              '이미지 업로드에 실패했습니다.\n\nS3 CORS 설정이 필요합니다.\n\n이미지 없이 문의를 접수하시겠습니까?'
            );
            
            if (!confirmWithoutImage) {
              setIsLoading(false);
              return;
            }
            
            // 이미지 없이 진행
            uploadedAttachments = [];
          } else {
            alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
            setIsLoading(false);
            return;
          }
        }
      }

      const requestData: {
        questionCategoryId: number;
        title: string;
        content: string;
        attachments?: { s3Key: string; fileSize: number }[];
      } = {
        questionCategoryId: selectedCategoryId,
        title,
        content,
      };

      if (uploadedAttachments.length > 0) {
        requestData.attachments = uploadedAttachments;
      }

      await questionService.createQuestion(requestData);
      
      setTitle('');
      setContent('');
      setImages([]);
      setShowConfirmModal(false);
      
      onSubmitSuccess();
    } catch (error) {
      console.error('문의 생성 실패:', error);
      
      if (error instanceof Error && error.message === 'Network Error') {
        alert('문의 접수 기능은 현재 백엔드 CORS 설정이 필요합니다.\n백엔드 팀에 문의해주세요.');
      } else {
        alert('문의 접수에 실패했습니다. 다시 시도해주세요.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* 문의 유형 */}
      <h3 className="text-base font-semibold mb-3 px-9">문의 유형</h3>
      <div className="flex flex-wrap gap-2 mb-8 px-9">
        {categories.map((category) => (
          <button
            key={category.questionCategoryId}
            onClick={() => setSelectedCategoryId(category.questionCategoryId)}
            className={`px-4 sm:px-5 py-2 rounded-full border transition-colors text-sm whitespace-nowrap ${
              selectedCategoryId === category.questionCategoryId
                ? 'border-[#219BE4] bg-[#E3F2FC] text-[#298EEE]'
                : 'border-[#DDDDDD] bg-white text-[#666666]'
            }`}
            aria-label={`${getCategoryDisplayName(category.questionCategoryName)} 선택`}
          >
            {getCategoryDisplayName(category.questionCategoryName)}
          </button>
        ))}
      </div>

      {/* 제목 */}
      <div className="mb-8 px-[33px]">
        <div className="flex items-center gap-1 mb-2">
          <h3 className="text-sm font-semibold">제목</h3>
          <span className="w-1.5 h-1.5 bg-red-500 rounded-full" aria-label="필수" />
          {titleError && (
            <span className="ml-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              !
            </span>
          )}
        </div>
        <input
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError && e.target.value.trim()) setTitleError(false);
          }}
          placeholder="제목을 입력해주세요"
          className="w-full px-4 py-3 rounded-lg border border-[#E4E9F0] focus:outline-none focus:border-[#678BF7] placeholder:font-light text-sm font-light"
          aria-label="문의 제목"
        />
      </div>

      {/* 내용 */}
      <div className="mb-6 px-[33px]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            <h3 className="text-base font-semibold">내용</h3>
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" aria-label="필수" />
            {contentError && (
              <span className="ml-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                !
              </span>
            )}
          </div>
          <span className="text-xs text-[#999999] pr-[3px]">{content.length} / 500</span>
        </div>
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value.slice(0, 500));
            if (contentError && e.target.value.trim().length >= 10) setContentError(false);
          }}
          placeholder="문의하실 내용을 상세히 적어주세요. 구체적인 상황을 알려주시면 빠른 처리가 가능합니다. (10자 이상 500자 이하)"
          className="w-full h-40 px-4 py-3 rounded-lg border border-[#E4E9F0] focus:outline-none focus:border-[#678BF7] resize-none placeholder:font-light text-sm font-light"
          aria-label="문의 내용"
        />
      </div>

      {/* 이미지 첨부 */}
      <div className="mb-6 px-[33px]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold">이미지 첨부</h3>
          <span className="text-xs text-[#999999] pr-[3px]">최대 3장</span>
        </div>
        <div className="flex gap-3">
          {images.map((image, index) => (
            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden bg-[#2C4A3B]">
              <img
                src={URL.createObjectURL(image)}
                alt={`첨부 이미지 ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 w-5 h-5 bg-[#2C4A3B] rounded-full flex items-center justify-center text-white text-xs"
                aria-label={`이미지 ${index + 1} 삭제`}
              >
                ×
              </button>
            </div>
          ))}
          {images.length < 3 && (
            <label className="w-20 h-20 rounded-lg border-2 border-dashed border-[#DDDDDD] flex flex-col items-center justify-center cursor-pointer bg-[#F5F5F5]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="5" width="18" height="16" rx="2" stroke="#999999" strokeWidth="1.5" />
                <circle cx="8.5" cy="10.5" r="1.5" fill="#999999" />
                <path d="M3 17L8 12L11 15" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11 13L14 10L21 17" stroke="#999999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-xs text-[#999999] mt-1">추가</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                aria-label="이미지 추가"
              />
            </label>
          )}
        </div>
      </div>

      {/* 유효성 검사 메시지 */}
      {validationMessage && (
        <p className="text-sm text-red-500 mb-4 text-center">{validationMessage}</p>
      )}

      {/* 제출 버튼 */}
      <div className="px-9">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-4 bg-[#678BF7] text-white rounded-xl font-semibold text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          aria-label="문의 접수하기"
        >
          {isLoading ? '접수 중...' : '문의 접수하기'}
        </button>
      </div>

      {/* 확인 모달 */}
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        message="문의 접수 후 문의 취소가 불가합니다.<br />정말 접수하시겠습니까?"
      />
    </div>
  );
}
