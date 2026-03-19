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
  SHARED_POOL_CONTRIBUTION: "가족 공유풀에 데이터가 반영되었습니다.",
  SHARED_POOL_THRESHOLD_CHANGE: "가족 공유 데이터 임계치가 변경되었습니다.",

  // Question
  ANSWER: "요청하신 문의 답변이 게시되었습니다.",

  // Policy_Change
  UPDATE_REPEAT_BLOCK: "반복적 차단 정책이 수정되었습니다.",
  UPDATE_IMMEDIATE_BLOCK: "즉시 차단 정책이 수정되었습니다.",
  POLICY_UPDATE_SHAREDATA_LIMIT: "월 공유 데이터 사용량 제한이 수정되었습니다.",
  POLICY_UPDATE_DAYDATA_LIMIT: "일 개인 데이터 사용량 제한이 수정되었습니다.",
  POLICY_UPDATE_APP_USAGE_LIMIT: "앱 데이터의 사용량 제한이 수정되었습니다.",
  POLICY_UPDATE_DATA_SPEED_LIMIT: "앱 데이터의 속도 제한이 수정되었습니다.",
  ACTIVATE_POLICY: "새로운 정책이 활성화되었습니다.",
  DEACTIVATE_POLICY: "새로운 정책이 비활성화되었습니다.",

  // Policy_Limit
  CREATE_REPEAT_BLOCK: "반복적 차단 정책이 생성되었습니다.",
  DELETE_REPEAT_BLOCK: "반복적 차단 정책이 삭제되었습니다.",
  POLICY_CREATE_IMMEDIATE_BLOCK: "즉시 차단 정책이 생성되었습니다.",
  POLICY_DELETE_IMMEDIATE_BLOCK: "즉시 차단 정책이 삭제되었습니다.",
  POLICY_CREATE_DAYDATA_LIMIT: "일 개인 데이터 사용량 제한이 생성되었습니다.",
  POLICY_DELETE_DAYDATA_LIMIT: "일 개인 데이터 사용량 제한이 삭제되었습니다.",
  POLICY_CREATE_SHAREDATA_LIMIT: "월 공유 데이터 사용량 제한이 생성되었습니다.",
  POLICY_DELETE_SHAREDATA_LIMIT: "월 공유 데이터 사용량 제한이 삭제되었습니다.",
  POLICY_CREATE_APP_USAGE_LIMIT: "앱 데이터의 사용량 제한이 생성되었습니다.",
  POLICY_DELETE_APP_USAGE_LIMIT: "앱 데이터의 사용량 제한이 삭제되었습니다.",
  POLICY_CREATE_DATA_SPEED_LIMIT: "앱 데이터의 속도 제한이 생성되었습니다.",
  POLICY_DELETE_DATA_SPEED_LIMIT: "앱 데이터의 속도 제한이 삭제되었습니다.",
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

// type(value.type) → alarmCode 매핑
export const TYPE_TO_ALARM_CODE: Record<string, string> = {
  // Family
  SHARED_POOL_THRESHOLD_REACHED_50: "FAMILY",
  SHARED_POOL_THRESHOLD_REACHED_30: "FAMILY",
  SHARED_POOL_THRESHOLD_REACHED_10: "FAMILY",
  SHARED_POOL_THRESHOLD_REACHED_CUS: "FAMILY",
  SHARED_POOL_CONTRIBUTION: "FAMILY",
  SHARED_POOL_THRESHOLD_CHANGE: "FAMILY",
  // Question
  ANSWER: "QUESTION",
  // Policy_Change
  UPDATE_REPEAT_BLOCK: "POLICY_CHANGE",
  UPDATE_IMMEDIATE_BLOCK: "POLICY_CHANGE",
  UPDATE_SHAREDATA_LIMIT: "POLICY_CHANGE",
  UPDATE_DAYDATA_LIMIT: "POLICY_CHANGE",
  UPDATE_APP_USAGE_LIMIT: "POLICY_CHANGE",
  UPDATE_DATA_SPEED_LIMIT: "POLICY_CHANGE",
  ACTIVATE_POLICY: "POLICY_CHANGE",
  DEACTIVATE_POLICY: "POLICY_CHANGE",
  // Policy_Limit
  CREATE_REPEAT_BLOCK: "POLICY_LIMIT",
  DELETE_REPEAT_BLOCK: "POLICY_LIMIT",
  CREATE_IMMEDIATE_BLOCK: "POLICY_LIMIT",
  DELETE_IMMEDIATE_BLOCK: "POLICY_LIMIT",
  CREATE_DAYDATA_LIMIT: "POLICY_LIMIT",
  DELETE_DAYDATA_LIMIT: "POLICY_LIMIT",
  CREATE_SHAREDATA_LIMIT: "POLICY_LIMIT",
  DELETE_SHAREDATA_LIMIT: "POLICY_LIMIT",
  CREATE_APP_USAGE_LIMIT: "POLICY_LIMIT",
  DELETE_APP_USAGE_LIMIT: "POLICY_LIMIT",
  CREATE_DATA_SPEED_LIMIT: "POLICY_LIMIT",
  DELETE_DATA_SPEED_LIMIT: "POLICY_LIMIT",
  POLICY_ADD_WHITELIST: "POLICY_LIMIT",
  POLICY_DELETE_WHITELIST: "POLICY_LIMIT",
  // Permission
  PERMISSION_CHANGED: "PERMISSION",
  ROLE_TRANSFERRED: "PERMISSION",
};
