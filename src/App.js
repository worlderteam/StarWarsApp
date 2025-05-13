import React, { useEffect } from 'react';
import { Platform, StatusBar } from 'react-native';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { I18nextProvider } from 'react-i18next';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RootNavigation from './navigation';
import { ToastProvider } from './components/CustomToast/ToastProvider';
import colorScheme from '../assets/themes/colorScheme';
import i18n from './utils/i18n';

const queryClient = new QueryClient();

PushNotification.configure({
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },
  onNotification: function (notification) {
    console.log("LOCAL NOTIFICATION ==>", notification);
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  requestPermissions: Platform.OS === 'ios',
});
PushNotification.createChannel({
  channelId: 'fcm_fallback_notification_channel',
  channelName: 'fcm_fallback_notification_channel',
});


if (Platform.OS === 'ios') {
  PushNotificationIOS.requestPermissions().then(
    (data) => {
      console.log("Push Notification Permission Granted:", data);
    },
    (error) => {
      console.error("Push Notification Permission Error:", error);
    })
}

const App = () => {
  useEffect(() => {
    if (Platform.OS === 'ios') {
      const type = 'notification';
      PushNotificationIOS.addEventListener(type, () => { });
      return () => {
        PushNotificationIOS.removeEventListener(type);
      };
    }
  });
  return (
    <>
     <I18nextProvider i18n={i18n}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colorScheme.$blackBg}
        translucent={false}
      />
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <RootNavigation />
        </ToastProvider>
      </QueryClientProvider>
     </I18nextProvider>
    </>
  );
};

export default App;