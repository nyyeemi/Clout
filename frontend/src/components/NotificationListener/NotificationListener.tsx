import {useEffect} from 'react';

import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';

import {removeNotification} from '../../redux/slices/notificationsSlice';
import {AppDispatch, RootState} from '../../redux/store/store';

export const NotificationListener = () => {
  const notifications = useSelector((state: RootState) => state.notifications);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (notifications.length === 0) {
      return;
    }

    const notif = notifications[0];
    Toast.show({
      type: notif.type,
      text1: notif.message,
      visibilityTime: 4000,
      onHide: () => {
        dispatch(removeNotification(notif.id));
      },
    });
  }, [notifications, dispatch]);

  return null;
};
