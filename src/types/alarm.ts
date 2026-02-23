export type AlarmCategory = 'all' | 'data' | 'policy' | 'permission' | 'etc';

export interface Alarm {
  id: string;
  category: Exclude<AlarmCategory, 'all'>;
  title: string;
  date: string;
  isRead: boolean;
}
