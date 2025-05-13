import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, PermissionsAndroid, Keyboard, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';

import useCustomLoader from '../../react-query/hooks/useCustomLoader';
import { loginRequest } from '../../react-query/states/apiServices';
import { ToastContext } from '../../components/CustomToast/ToastProvider';
import { BOTTOM_TAB_BAR, REGISTER_SCREEN } from '../../constants/RootKey';
import Storage from '../../utils/Storages';
import { StorageKey } from '../../utils/GlobalConfig';
import { validateEmail, validatePassword } from '../../utils/GlobalFunction';
import colorScheme from '../../../assets/themes/colorScheme';
import styles from './styles';

const LoginScreen = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const toast = useContext(ToastContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoadingLogin, setIsLoadingLogin] = useState(false)

  const { data, errorMessage, error, fetch: fetchLogin } = useCustomLoader({
    fetchFunction: loginRequest,
    params: {},
    options: {
      fetchOnLoad: false,
    },
  });

  useEffect(() => {
    if (data) {
      setIsLoadingLogin(false)
      Storage.setItem(StorageKey.CURR_USER_LOGIN_DATA, data)
      toast.current.ShowToastFunction("success", t('login.loginSuccess'));
      navigation.navigate(BOTTOM_TAB_BAR)
    }
  }, [data])

  useEffect(() => {
    if (error) {
      setIsLoadingLogin(false)
      toast.current.ShowToastFunction("error", errorMessage);
    }
  }, [error])

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Location Permission",
            message: "This app needs access to your location",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          resolve({ latitude, longitude });
        },
        error => reject(error),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    });
  };

  const handleLogin = async () => {
    Keyboard.dismiss()
    if (!email.trim()) {
      toast.current.ShowToastFunction("error", t('login.emailRequired'));
      return;
    }
    if (!password.trim()) {
      toast.current.ShowToastFunction("error", t('login.passwordRequired'));
      return;
    }
    if (!validateEmail(email)) {
      toast.current.ShowToastFunction('error', t('common.emailValidation'));
      return;
    }
    if (!validatePassword(password)) {
      toast.current.ShowToastFunction('error', t('common.passwordValidation'));
      return;
    }
    setIsLoadingLogin(true)
    requestLocationPermission().then(granted => {
      if (granted) {
        getCurrentLocation().then(location => {
          updateUserLocation(email, location).then(() => {
            fetchLogin({ email, password, date: moment.now() })
          });
        }).catch((error) => {
          setIsLoadingLogin(false)
          toast.current.ShowToastFunction("error", t('login.locationError'));
        });
      } else {
        setIsLoadingLogin(false)
        toast.current.ShowToastFunction("error", t('login.locationError'));
      }
    });
  };

  const updateUserLocation = async (email, location) => {
    const users = await Storage.getItem(StorageKey.LIST_USER);
    if (users) {
      const updatedUsers = users.map(user => {
        if (user.email === email.toLowerCase()) {
          return { ...user, ...location };
        }
        return user;
      });
      await Storage.setItem(StorageKey.LIST_USER, updatedUsers);
    }
  };

  const handleRegister = () => {
    navigation.navigate(REGISTER_SCREEN);
  };

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
      <Text style={styles.title}>{t('login.title')}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholderTextColor={colorScheme.$gray}
          placeholder={t('login.emailPlaceholder')}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholderTextColor={colorScheme.$gray}
          placeholder={t('login.passwordPlaceholder')}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {isLoadingLogin ? (
          <ActivityIndicator size="large" color={colorScheme.$primaryBlueColor} style={{ marginBottom: 20 }} />
        ) : (
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>{t('login.loginButton')}</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => console.log('Forgot Password Pressed')}>
          <Text style={styles.forgotPasswordText}>{t('login.forgotPasswordText')}</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <Text style={styles.noAccountText}>{t('login.noAccountText')}</Text>

        <TouchableOpacity
          disabled={isLoadingLogin}
          style={styles.registerButton}
          onPress={handleRegister}>
          <Text style={styles.registerButtonText}>{t('login.registerButtonText')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;