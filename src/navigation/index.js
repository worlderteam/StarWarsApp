import React, { Suspense, lazy, useEffect } from 'react';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { PermissionsAndroid, Platform } from 'react-native';
const NavigatorLazy = lazy(() => import('./Stacks/Navigator'));

const RootNavigation = () => {
  const requestNotificationPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (result === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Notification Permission Granted");
      } else {
        console.log("Notification Permission Denied");
      }
    }
  };

  const onRemoteNotification = (notification) => {
    const result = PushNotificationIOS.FetchResult.NoData;
    notification.finish(result);
  };

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const type = 'notification';
      PushNotificationIOS.addEventListener(type, onRemoteNotification);
      return () => {
        PushNotificationIOS.removeEventListener(type);
      };
    }
    else {
      requestNotificationPermission()
    }
  }, []);

  return (
    <Suspense>
      <NavigatorLazy />
    </Suspense>
  );
};

export default RootNavigation;
