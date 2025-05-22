import store from '../../store/store';
import {NotificationPayload, addNotification} from '../notificationsSlice';

export const setNotification = (payload: NotificationPayload) => {
  store.dispatch(addNotification(payload));
};
