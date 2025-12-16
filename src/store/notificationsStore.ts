// stores/notifications.store.ts
import { create } from "zustand";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: string;
  is_read: boolean;
  created_at: string;
  metadata?: Record<string, any>;
}

interface NotificationsState {
  notifications: Record<string, Notification>;
  selectedNotification: Notification | null;

  setNotifications: (data: Notification[]) => void;
  upsertNotification: (notification: Notification) => void;
  selectNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearSelected: () => void;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: {},
  selectedNotification: null,

  setNotifications: (data) =>
    set(() => ({
      notifications: Object.fromEntries(data.map((n) => [n.id, n])),
    })),

  upsertNotification: (notification) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        [notification.id]: notification,
      },
    })),

  selectNotification: (id) =>
    set((state) => ({
      selectedNotification: state.notifications[id] ?? null,
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        [id]: {
          ...state.notifications[id],
          is_read: true,
        },
      },
      selectedNotification:
        state.selectedNotification?.id === id
          ? { ...state.selectedNotification, is_read: true }
          : state.selectedNotification,
    })),

  clearSelected: () => set({ selectedNotification: null }),
}));
