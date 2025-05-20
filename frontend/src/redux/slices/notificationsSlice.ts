import {PayloadAction, createSlice, nanoid} from '@reduxjs/toolkit';

import store from '../store/store';

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
      prepare: (payload: {type: NotificationType; message: string}) => {
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

export const setNotification = (payload: NotificationPayload) => {
  store.dispatch(addNotification(payload));
};
export default notificationsSlice.reducer;
