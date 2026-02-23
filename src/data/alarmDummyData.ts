import type { Alarm } from '../types/alarm';

export const alarmDummyData: Alarm[] = [
  {
    id: '1',
    category: 'data',
    title: '공유 받은 데이터 30%를 사용하셨습니다.',
    date: '26.02.12',
    isRead: false,
  },
  {
    id: '2',
    category: 'policy',
    title: '가족 정책이 변경되었습니다.',
    date: '26.02.12',
    isRead: true,
  },
  {
    id: '3',
    category: 'permission',
    title: '대표자가 구성원 정보 전체보기 권한을 부여하였습니다.',
    date: '26.02.11',
    isRead: false,
  },
  {
    id: '4',
    category: 'data',
    title: '개인 데이터를 100%를 사용하셨습니다.',
    date: '26.02.10',
    isRead: true,
  },
  {
    id: '5',
    category: 'etc',
    title: '문의하신 기능 지원 요청이 완료되었습니다.',
    date: '26.02.09',
    isRead: true,
  },
];
