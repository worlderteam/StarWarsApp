import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import PushNotification from 'react-native-push-notification';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import { G, Text as TextSVG } from 'react-native-svg';
import { PieChart } from 'react-native-svg-charts';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import useCustomLoader from '../../react-query/hooks/useCustomLoader';
import { fetchGroupDataRequest } from '../../react-query/states/apiServices';
import Storage from '../../utils/Storages';
import { getRandomColor } from '../../utils/GlobalFunction';
import { Metrics, StorageKey } from '../../utils/GlobalConfig';
import styles from './styles';
import { GROUP_DETAIL_SCREEN } from '../../constants/RootKey';
import HomeHeader from './components/HomeHeader';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

const GroupHomeScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState('Joined Group');
  const { t } = useTranslation();

  const tabList = [
    {
      id: 1,
      tabName: t('groupHome.joinedTab'),
    },
    {
      id: 2,
      tabName: t('groupHome.unjoinedTab'),
    },
  ];

  const { data: dataGroup, loading: isLoadingGroupData, error, fetch: fetchGroupData } = useCustomLoader({
    fetchFunction: fetchGroupDataRequest,
    isFetchOnLoad: false,
  });

  const groups = useMemo(() => {
    if (dataGroup && activeTab) {
      if (activeTab === t('groupHome.joinedTab')) {
        return dataGroup.joinedGroups;
      }
      return dataGroup.unjoinedGroups;
    }
    return [];
  }, [dataGroup, activeTab]);

  useEffect(() => {
    if (isFocused) {
      fetchInit();
    }
  }, [isFocused]);

  const fetchInit = async () => {
    const currentUser = await Storage.getItem(StorageKey.CURR_USER_LOGIN_DATA);

    if (currentUser) {
      checkForUnreadNotifications(currentUser);
      fetchGroupData({ email: currentUser.email, date: moment.now() });
    }
  };

  const checkForUnreadNotifications = async (currentUser) => {
    const notifications = currentUser.notifications || [];
    const unreadNotifications = notifications.filter((notification) => notification.isRead === false);

    if (unreadNotifications.length > 0) {
      setActiveTab(t('groupHome.unjoinedTab'));

      unreadNotifications.forEach((unreadNotification) => {
        sendPushNotification(unreadNotification.message);
      });

      const updatedNotifications = notifications.map((notification) =>
        unreadNotifications.some((unreadNotification) => unreadNotification.groupId === notification.groupId)
          ? { ...notification, isRead: true }
          : notification
      );

      const updatedUserData = { ...currentUser, notifications: updatedNotifications };

      await Storage.setItem(StorageKey.CURR_USER_LOGIN_DATA, updatedUserData);

      const registeredUsers = await Storage.getItem(StorageKey.LIST_USER) || [];

      const updatedUsers = registeredUsers.map((user) =>
        user.email.toLowerCase() === currentUser.email.toLowerCase()
          ? { ...user, notifications: updatedNotifications }
          : user
      );

      await Storage.setItem(StorageKey.LIST_USER, updatedUsers);
    }
  };

  const sendPushNotification = (message) => {
    if (Platform.OS === 'ios') {
      PushNotificationIOS.addNotificationRequest({
        id: 'notification_id',
        title: t('groupHome.notificationTitle'),
        body: message,
        sound: 'default',
      });
    } else {
      PushNotification.localNotification({
        title: t('groupHome.notificationTitle'),
        message: message,
        playSound: true,
        soundName: 'default',
        importance: 'high',
        allowWhileIdle: true,
      });
    }
  };

  const generateInitials = (name) => {
    if (name) {
      const words = name.split(' ');
      return words.map(word => word[0].toUpperCase()).join('');
    }
    return '';
  };

  const renderMemberAvatars = (members) => {
    return members.map((member, index) => (
      <Image
        key={index}
        source={{ uri: `data:image/jpeg;base64,${member.photo}` }}
        style={styles.memberAvatar}
      />
    ));
  };

  const renderGroupItem = ({ item }) => {
    const { groupName, members } = item;

    const roleCounts = {};
    members.forEach(member => {
      const role = member.userRole;
      if (roleCounts[role]) {
        roleCounts[role]++;
      } else {
        roleCounts[role] = 1;
      }
    });

    const roleLabels = Object.keys(roleCounts);
    const roleCountArray = Object.values(roleCounts);
    const sliceColor = roleLabels.map(() => getRandomColor());

    const pieData = roleCountArray.map((value, index) => ({
      value,
      svg: {
        fill: sliceColor[index],
      },
      key: `pie-${index}`,
    }));

    const Labels = ({ slices }) => {
      return slices.map((slice, index) => {
        const { pieCentroid, data } = slice;
        return (
          <G key={`label-${index}`} x={pieCentroid[0]} y={pieCentroid[1]}>
            <TextSVG
              x={0}
              y={0}
              fill="white"
              textAnchor="middle"
              alignmentBaseline="middle"
              fontSize="18"
              fontWeight="bold"
            >
              {data.value}
            </TextSVG>
          </G>
        );
      });
    };

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate(GROUP_DETAIL_SCREEN, { groupData: item, activeTab })}
        style={styles.groupCard}
      >
        <View style={styles.groupHeader}>
          <View style={styles.groupIcon}>
            <Text style={styles.groupInitials}>{generateInitials(groupName)}</Text>
          </View>
          <Text style={styles.groupTitle}>{groupName}</Text>
        </View>

        <Text style={styles.memberCount}>{t('groupHome.members', { count: members.length })}</Text>
        <View style={styles.memberList}>{renderMemberAvatars(members)}</View>

        <View style={styles.pieChartContainer}>
          <PieChart
            style={{ height: Metrics.SCREEN_WIDTH * 0.4, width: Metrics.SCREEN_WIDTH * 0.4 }}
            data={pieData}
            innerRadius={members?.length > 1 ? 1 : 0}
            outerRadius="95%"
          >
            <Labels />
          </PieChart>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.leftColumn}>
            {roleLabels.slice(0, Math.ceil(roleLabels.length / 2)).map((role, index) => (
              <Text key={index} style={[styles.roleText, { color: sliceColor[index] }]}>
                {role}
              </Text>
            ))}
          </View>
          <View style={styles.rightColumn}>
            {roleLabels.slice(Math.ceil(roleLabels.length / 2)).map((role, index) => (
              <Text
                key={index + roleLabels.length / 2}
                style={[styles.roleText, { color: sliceColor[index + roleLabels.length / 2] }]}
              >
                {role}
              </Text>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.containerSafeArea}>
      <HomeHeader activeTab={activeTab} setActiveTab={setActiveTab} tabList={tabList} />
      <View style={styles.container}>
        <FlatList
          data={groups}
          renderItem={renderGroupItem}
          keyExtractor={(item) => item.groupId}
          ListEmptyComponent={
            <View style={styles.emptyStateContainer}>
              <Ionicons name="people-outline" size={100} color="#ccc" />
              <Text style={styles.emptyStateTitle}>{t('groupHome.noGroupsTitle')}</Text>
              <Text style={styles.emptyStateSubtitle}>{t('groupHome.noGroupsSubtitle1')}</Text>
              <Text style={styles.emptyStateSubtitle}>{t('groupHome.noGroupsSubtitle2')}</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default GroupHomeScreen;