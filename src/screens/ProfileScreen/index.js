import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import styles from './styles';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import useCustomLoader from '../../react-query/hooks/useCustomLoader';
import { fetchCurrentUserRequest } from '../../react-query/states/apiServices';
import moment from 'moment';
import { handleLogout } from '../../utils/GlobalFunction';

const ProfileScreen = () => {
  const { t, i18n } = useTranslation();
  const [userData, setUserData] = useState(null);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const { data: currUserData, loading: isLoadingCurrUser, error: currUserError, fetch: fetchCurrentUser } = useCustomLoader({
    fetchFunction: fetchCurrentUserRequest,
    isFetchOnLoad: false,
  });

  useEffect(() => {
    if (isFocused) {
      fetchCurrentUser({ date: moment.now() });
    }
  }, [isFocused]);

  useEffect(() => {
    if (currUserData) {
      setUserData({
        photo: currUserData.photo,
        userDetail: [
          { label: t('profile.email'), value: currUserData.email },
          { label: t('profile.role'), value: currUserData.userRole },
          { label: t('profile.height'), value: currUserData.roleDetail.height },
          { label: t('profile.mass'), value: currUserData.roleDetail.mass },
          { label: t('profile.birthYear'), value: currUserData.roleDetail.birth_year },
          { label: t('profile.gender'), value: currUserData.roleDetail.gender },
        ],
      });
    }
  }, [currUserData, t]);

  if (isLoadingCurrUser) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('profile.loading')}</Text>
      </View>
    );
  }

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={toggleLanguage} style={styles.toggleLanguageButton}>
        <Text style={styles.toggleLanguageText}>
          {i18n.language === 'en' ? 'EN' : 'ID'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.profileTitle}>{t('profile.title')}</Text>
      {userData?.photo && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: `data:image/jpeg;base64,${userData.photo}` }} style={styles.profileImage} />
        </View>
      )}
      {userData?.userDetail && userData.userDetail.map((detail, index) => (
        <View key={index} style={styles.profileDetail}>
          <Text style={styles.detailLabel}>{detail.label}:</Text>
          <Text style={styles.detailText}>{detail.value}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.logoutButton} onPress={() => handleLogout(navigation)}>
        <Text style={styles.logoutButtonText}>{t('profile.logout')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ProfileScreen;