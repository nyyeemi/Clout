// notificationsSlice.ts
import {PayloadAction, createSlice, nanoid} from '@reduxjs/toolkit';

type NotificationType = 'success' | 'error' | 'info' | 'warning';

type NotificationPayload = {
  type: NotificationType;
  message: string;
};

type Notification = {
  id: string;
  type: NotificationType;
  message: string;
};

const initialState: Notification[] = [];

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: {
      reducer: (state, action: PayloadAction<Notification>) => {
        state.push(action.payload);
      },
      prepare: (payload: NotificationPayload) => {
        const id = nanoid();
        return {payload: {id, ...payload}};
      },
    },
    removeNotification: (state, action: PayloadAction<string>) =>
      state.filter(n => n.id !== action.payload),
    clearNotifications: () => [],
  },
});

export const {addNotification, removeNotification, clearNotifications} =
  notificationsSlice.actions;

export default notificationsSlice.reducer;
export type {NotificationType, NotificationPayload};
