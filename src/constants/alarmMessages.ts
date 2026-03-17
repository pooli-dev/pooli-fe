import type { AlarmCategory } from "@/types/alarm";

// constants/alarmMessages.ts
export const ALARM_MESSAGE_MAP: Record<string, string> = {
  // Family
  SHARED_POOL_THRESHOLD_REACHED_50:
    "공유 데이터 풀의 잔여량이 50%에 도달했습니다.",
  SHARED_POOL_THRESHOLD_REACHED_30:
    "공유 데이터 풀의 잔여량이 30%에 도달했습니다.",
  SHARED_POOL_THRESHOLD_REACHED_10:
    "공유 데이터 풀의 잔여량이 10%에 도달했습니다.",
  SHARED_POOL_THRESHOLD_REACHED_CUS:
    "공유 데이터 풀의 잔여량이 설정한 기준에 도달했습니다.",

  // Question
  ANSWER: "요청하신 문의 답변이 게시되었습니다.",

  // Policy_Change
  UPDATE_REPEAT_BLOCK: "반복적 차단 정책이 수정되었습니다.",
  UPDATE_IMMEDIATE_BLOCK: "즉시 차단 정책이 수정되었습니다.",
  UPDATE_SHAREDATA_LIMIT: "월 공유 데이터 사용량 제한이 수정되었습니다.",
  UPDATE_DAYDATA_LIMIT: "일 개인 데이터 사용량 제한이 수정되었습니다.",
  UPDATE_APP_USAGE_LIMIT: "앱 데이터의 사용량 제한이 수정되었습니다.",
  UPDATE_DATA_SPEED_LIMIT: "앱 데이터의 속도 제한이 수정되었습니다.",
  ACTIVATE_POLICY: "새로운 정책이 활성화되었습니다.",
  DEACTIVATE_POLICY: "새로운 정책이 비활성화되었습니다.",

  // Policy_Limit
  CREATE_REPEAT_BLOCK: "반복적 차단 정책이 생성되었습니다.",
  DELETE_REPEAT_BLOCK: "반복적 차단 정책이 삭제되었습니다.",
  CREATE_IMMEDIATE_BLOCK: "즉시 차단 정책이 생성되었습니다.",
  DELETE_IMMEDIATE_BLOCK: "즉시 차단 정책이 삭제되었습니다.",
  CREATE_DAYDATA_LIMIT: "일 개인 데이터 사용량 제한이 생성되었습니다.",
  DELETE_DAYDATA_LIMIT: "일 개인 데이터 사용량 제한이 삭제되었습니다.",
  CREATE_SHAREDATA_LIMIT: "월 공유 데이터 사용량 제한이 생성되었습니다.",
  DELETE_SHAREDATA_LIMIT: "월 공유 데이터 사용량 제한이 삭제되었습니다.",
  CREATE_APP_USAGE_LIMIT: "앱 데이터의 사용량 제한이 생성되었습니다.",
  DELETE_APP_USAGE_LIMIT: "앱 데이터의 사용량 제한이 삭제되었습니다.",
  CREATE_DATA_SPEED_LIMIT: "앱 데이터의 속도 제한이 생성되었습니다.",
  DELETE_DATA_SPEED_LIMIT: "앱 데이터의 속도 제한이 삭제되었습니다.",
  POLICY_ADD_WHITELIST: "앱 정책 화이트리스트가 추가되었습니다.",
  POLICY_DELETE_WHITELIST: "앱 정책 화이트리스트가 삭제되었습니다.",

  // Permission
  PERMISSION_CHANGED: "권한이 변경되었습니다.",
  ROLE_TRANSFERRED: "가족 구성원의 대표가 변경되었습니다.",
};

// alarmCode → category 매핑
export const ALARM_CODE_TO_CATEGORY: Record<string, AlarmCategory> = {
  FAMILY: "data",
  USER: "data",
  POLICY_CHANGE: "policy",
  POLICY_LIMIT: "policy",
  PERMISSION: "permission",
  QUESTION: "etc",
  OTHERS: "etc",
};
