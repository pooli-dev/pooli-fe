import { create } from 'zustand';
import type { Alarm } from '../types/alarm';
import { alarmDummyData } from '../data/alarmDummyData';

interface AlarmStore {
  alarms: Alarm[];
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  getUnreadCount: () => number;
}

export const useAlarmStore = create<AlarmStore>((set, get) => ({
  alarms: alarmDummyData,
  
  markAsRead: (id: string) => {
    set(state => ({
      alarms: state.alarms.map(alarm =>
        alarm.id === id ? { ...alarm, isRead: true } : alarm
      ),
    }));
  },
  
  markAllAsRead: () => {
    set(state => ({
      alarms: state.alarms.map(alarm => ({ ...alarm, isRead: true })),
    }));
  },
  
  getUnreadCount: () => {
    return get().alarms.filter(alarm => !alarm.isRead).length;
  },
}));
