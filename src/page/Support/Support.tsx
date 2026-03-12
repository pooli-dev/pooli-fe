import { useState, useEffect, useCallback } from "react";
import {
  questionService,
  getCategoryDisplayName,
  type QuestionCategory,
} from "../../api/services/questionService";
import InquiryForm from "./components/InquiryForm";
import InquiryHistory, { type Inquiry } from "./components/InquiryHistory";

/**
 * 고객지원 페이지 컴포넌트
 * @returns 고객지원 페이지 JSX
 */
export default function Support() {
  const [activeTab, setActiveTab] = useState<"inquiry" | "history">("inquiry");
  const [categories, setCategories] = useState<QuestionCategory[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");

  // 카테고리 조회
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await questionService.getCategories();
        setCategories(response.questionCategories);
      } catch (error) {
        console.error("카테고리 조회 실패:", error);
        // 백엔드 에러 시 기본 카테고리 사용
        const defaultCategories: QuestionCategory[] = [
          { questionCategoryId: 1, questionCategoryName: "policy_inquiry" },
          { questionCategoryId: 2, questionCategoryName: "bug_report" },
          { questionCategoryId: 3, questionCategoryName: "others" },
        ];
        setCategories(defaultCategories);
      }
    };
    fetchCategories();
  }, []);

  // 문의 내역 조회
  const fetchInquiries = useCallback(async () => {
    try {
      const response = await questionService.getQuestions(0, 100);

      // API 응답을 UI 형식으로 변환
      const formattedInquiries: Inquiry[] = await Promise.all(
        response.content.map(async (item) => {
          try {
            const detail = await questionService.getQuestionDetail(
              item.questionId,
            );
            const category = categories.find(
              (c) => c.questionCategoryId === item.questionCategoryId,
            );

            return {
              id: item.questionId,
              categoryId: item.questionCategoryId,
              categoryName: category
                ? getCategoryDisplayName(category.questionCategoryName)
                : "기타",
              title: item.title,
              content: detail.content,
              status: item.isAnswer ? "완료" : "대기중",
              date: new Date(detail.createdAt)
                .toLocaleDateString("ko-KR")
                .replace(/\. /g, ".")
                .slice(0, -1),
              response: detail.answer?.content,
              responseDate: detail.answer
                ? new Date(detail.answer.createdAt)
                    .toLocaleDateString("ko-KR")
                    .replace(/\. /g, ".")
                    .slice(0, -1)
                : undefined,
              attachments: detail.attachments,
              responseAttachments: detail.answer?.attachments,
            };
          } catch (error) {
            console.error(`문의 ${item.questionId} 상세 조회 실패:`, error);
            const category = categories.find(
              (c) => c.questionCategoryId === item.questionCategoryId,
            );
            return {
              id: item.questionId,
              categoryId: item.questionCategoryId,
              categoryName: category
                ? getCategoryDisplayName(category.questionCategoryName)
                : "기타",
              title: item.title,
              content: "",
              status: item.isAnswer ? "완료" : "대기중",
              date: "",
            };
          }
        }),
      );

      setInquiries(formattedInquiries);
    } catch (error) {
      console.error("문의 내역 조회 실패:", error);
      setInquiries([]);
    }
  }, [categories]);

  useEffect(() => {
    if (activeTab === "history" && categories.length > 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchInquiries();
    }
  }, [activeTab, categories.length, fetchInquiries]);

  const handleSubmitSuccess = () => {
    setActiveTab("history");
    void fetchInquiries();
  };

  return (
    <div className="relative h-[calc(100dvh-106px-60px)] overflow-y-auto mt-[106px] mb-[60px]">
      <div className="py-5 pb-[60px]">
        {/* 탭 */}
        <div className="bg-[#E8E8E8] rounded-2xl p-1 mx-9 mb-6 flex gap-1 justify-center">
          <button
            onClick={() => setActiveTab("inquiry")}
            className={`flex-1 max-w-[200px] py-2 rounded-2xl font-medium transition-colors text-sm ${
              activeTab === "inquiry"
                ? "bg-white text-[#219BE4]"
                : "bg-transparent text-[#999999]"
            }`}
            aria-label="문의하기 탭"
          >
            문의하기
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`flex-1 max-w-[200px] py-2 rounded-2xl font-medium transition-colors text-sm ${
              activeTab === "history"
                ? "bg-white text-[#219BE4]"
                : "bg-transparent text-[#999999]"
            }`}
            aria-label="문의내역 탭"
          >
            문의내역
          </button>
        </div>

        {activeTab === "inquiry" ? (
          <InquiryForm
            categories={categories}
            onSubmitSuccess={handleSubmitSuccess}
          />
        ) : (
          <InquiryHistory
            inquiries={inquiries}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
          />
        )}
      </div>
    </div>
  );
}
