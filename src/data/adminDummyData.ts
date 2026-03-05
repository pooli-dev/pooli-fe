export const dummyUsers = [
  {
    id: '1',
    name: '김민수',
    phone: '010-1234-5678',
    role: '자녀',
    groupId: '10245',
    dataUsage: { used: 15.2, total: 20 },
    familyMembers: [
      { name: '김철수', role: '부모', phone: '010-1111-2222' },
      { name: '김영희', role: '부모', phone: '010-3333-4444' },
    ],
    sharedPool: {
      total: 200,
      used: 150.4,
      remaining: 49.6,
      percentage: 75.2,
    },
  },
  {
    id: '2',
    name: '박영희',
    phone: '010-9876-5432',
    role: '부모',
    groupId: '10246',
    dataUsage: { used: 8.5, total: 15 },
    familyMembers: [
      { name: '박지훈', role: '자녀', phone: '010-5555-6666' },
    ],
    sharedPool: {
      total: 150,
      used: 89.3,
      remaining: 60.7,
      percentage: 59.5,
    },
  },
];

export const dummyInquiries = [
  {
    id: 1,
    userName: '김민수',
    phone: '010-1234-5678',
    title: '데이터 사용량 문의',
    content: '이번 달 데이터 사용량이 갑자기 증가했는데 확인 부탁드립니다.',
    date: '2023-11-23 14:30',
    status: 'pending' as const,
  },
  {
    id: 2,
    userName: '이영희',
    phone: '010-2345-6789',
    title: '앱 차단 해제 요청',
    content: '유튜브 앱 차단을 일시적으로 해제해주실 수 있나요?',
    date: '2023-11-23 10:15',
    status: 'answered' as const,
  },
  {
    id: 3,
    userName: '박철수',
    phone: '010-3456-7890',
    title: '정책 변경 문의',
    content: '자녀 계정의 사용 시간 제한을 변경하고 싶습니다.',
    date: '2023-11-22 16:20',
    status: 'pending' as const,
  },
  {
    id: 4,
    userName: '최지은',
    phone: '010-4567-8901',
    title: '공유 데이터 문의',
    content: '가족 공유 데이터 풀 설정 방법을 알고 싶습니다.',
    date: '2023-11-21 09:30',
    status: 'answered' as const,
  },
];

export const dummyPolicies = [
  {
    id: 1,
    name: '날짜별 반복 차단 정책',
    category: '반복 차단',
    lastModified: '2023-11-23 10:00',
    status: true,
  },
  {
    id: 2,
    name: '즉시 차단 정책',
    category: '즉시 차단',
    lastModified: '2023-11-23 09:30',
    status: false,
  },
  {
    id: 3,
    name: '월 공유 데이터 사용량 제한',
    category: '데이터 제한',
    lastModified: '2023-11-22 16:45',
    status: true,
  },
  {
    id: 4,
    name: '하루 총 데이터 사용량 제한',
    category: '데이터 제한',
    lastModified: '2023-11-22 15:00',
    status: true,
  },
  {
    id: 5,
    name: '어플리케이션 속도 제한',
    category: '앱별 제한',
    lastModified: '2023-11-21 11:20',
    status: true,
  },
  {
    id: 6,
    name: '어플리케이션 최대 데이터 제한',
    category: '앱별 제한',
    lastModified: '2023-11-21 10:15',
    status: false,
  },
];
