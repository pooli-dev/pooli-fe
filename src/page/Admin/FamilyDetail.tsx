import { useNavigate } from "react-router-dom";
import type { FamilyMembersByLineResponse } from "@/api/services/familyService";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { familyService } from "@/api";
import AdminFamilyMemberList from "@/page/Admin/components/AdminFamilyMemberList";

export default function FamilyDetail() {
  const navigate = useNavigate();

  // URL에서 lineId를 가져오거나, 없으면 첫 번째 회선 사용
  const searchParams = new URLSearchParams(window.location.search);
  const lineIdParam = searchParams.get('lineId');

  const { data: familyData, isLoading: isFamilyLoading } =
    useQuery<FamilyMembersByLineResponse>({
      queryKey: ["familyMembersByLine", lineIdParam],
      queryFn: () => familyService.getMembersByLine(Number(lineIdParam)).then((res) => res.data),
      enabled: !!lineIdParam,
      refetchInterval: 10000,
      refetchIntervalInBackground: true,
      placeholderData: keepPreviousData,
    });

  const isLoading = isFamilyLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="w-10 h-10 border-4 border-[#678BF7] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lineIdParam) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">가족 상세정보</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← 돌아가기
          </button>
        </div>
        <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <p className="text-gray-400">회선 정보가 필요합니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">가족 상세정보</h1>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          ← 돌아가기
        </button>
      </div>

      <div className="flex flex-col items-center gap-5">
        {familyData && familyData.members && familyData.members.length > 0 ? (
          <div className="w-full max-w-4xl">
            <AdminFamilyMemberList members={familyData.members} />
          </div>
        ) : (
          <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-400">가족 구성원 정보가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}
