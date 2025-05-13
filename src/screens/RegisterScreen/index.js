import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, Image, KeyboardAvoidingView, Platform, ScrollView, PermissionsAndroid } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
import Geolocation from '@react-native-community/geolocation';
import { SafeAreaView } from 'react-native-safe-area-context';
import RNFS from 'react-native-fs';
import _ from 'lodash';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

import { ToastContext } from '../../components/CustomToast/ToastProvider';
import { registerRequest } from '../../react-query/states/apiServices';
import useCustomLoader from '../../react-query/hooks/useCustomLoader';
import Storage from '../../utils/Storages';

import { BOTTOM_TAB_BAR, CREATE_GROUP_SCREEN, GROUP_HOME_SCREEN, LOGIN_SCREEN, SWAPI_SCREEN } from '../../constants/RootKey';
import { StorageKey } from '../../utils/GlobalConfig';
import { validateEmail, validatePassword } from '../../utils/GlobalFunction';
import colorScheme from '../../../assets/themes/colorScheme';
import styles from './styles';

const RegisterScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const route = useRoute();
  const toast = useContext(ToastContext);
  const [currRegisterPage, setCurrRegisterPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCameraPermitted, setIsCameraPermitted] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [base64Photo, setBase64Photo] = useState(null);
  const [navigateTarget, setNavigateTarget] = useState('');
  const cameraRef = useRef(null);
  const device = useCameraDevice('front');

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    userRole: '',
    roleDetail: {},
  });

  const { data, fetch: fetchRegister } = useCustomLoader({
    fetchFunction: registerRequest,
    isFetchOnLoad: false,
  });

  const inputFields = [
    { label: t('register.email'), placeholder: t('register.email'), key: 'email', gap: true },
    { label: t('register.firstName'), placeholder: t('register.firstNamePlaceholder'), key: 'firstName', separator: true },
    { label: t('register.lastName'), placeholder: t('register.lastNamePlaceholder'), key: 'lastName', gap: true },
    { label: t('register.password'), placeholder: t('register.passwordPlaceholder'), key: 'password', separator: true, secureTextEntry: true },
    { label: t('register.confirmPassword'), placeholder: t('register.confirmPasswordPlaceholder'), key: 'confirmPassword', gap: true, secureTextEntry: true },
  ];

  useEffect(() => {
    if (route.params?.selectedSwapi) {
      const selectedSwapi = route.params.selectedSwapi;
      setFormData((prev) => ({
        ...prev,
        userRole: selectedSwapi.name,
        roleDetail: selectedSwapi,
      }));
    }
  }, [route.params?.selectedSwapi]);

  useEffect(() => {
    if (currRegisterPage === 2) {
      const getPermission = async () => {
        const permission = await Camera.requestCameraPermission();
        setIsCameraPermitted(permission === 'granted');
      };
      getPermission();
    }
  }, [currRegisterPage]);

  useEffect(() => {
    if (data && isModalVisible) {
      const handleRegisteredData = async () => {
        let registeredUsers = await Storage.getItem(StorageKey.LIST_USER);
        registeredUsers = registeredUsers || [];
        const userExists = _.some(registeredUsers, (user) => user.email.toLowerCase() === data.email.trim().toLowerCase());

        if (userExists) {
          toast.current.ShowToastFunction("error", t('register.emailAlreadyRegistered'));
        } else {
          registeredUsers.push(data);
          Storage.setItem(StorageKey.LIST_USER, registeredUsers);
          Storage.setItem(StorageKey.CURR_USER_LOGIN_DATA, { email: data.email, password: data.password })
          toast.current.ShowToastFunction("success", t('register.successfulRegistration'));
          requestLocationPermission().then(granted => {
            if (granted) {
              getCurrentLocation().then(location => {
                updateUserLocation(data.email, location).then(() => {
                  if (navigateTarget === CREATE_GROUP_SCREEN) {
                    navigation.reset({
                      index: 1,
                      routes: [
                        { name: BOTTOM_TAB_BAR },
                        { name: CREATE_GROUP_SCREEN }
                      ],
                    });
                  } else if (navigateTarget === GROUP_HOME_SCREEN) {
                    navigation.reset({
                      index: 0,
                      routes: [{ name: BOTTOM_TAB_BAR }],
                    });
                  }
                });
              }).catch(() => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: LOGIN_SCREEN }],
                });
                toast.current.ShowToastFunction("error", t('register.locationPermissionRequired'));
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: LOGIN_SCREEN }],
              });
              toast.current.ShowToastFunction("error", t('register.locationPermissionRequired'));
            }
          });
        }
        setIsModalVisible(false);
        setNavigateTarget('');
      };
      if (data.email === formData.email) {
        handleRegisteredData();
      }
    }
  }, [data, isModalVisible, navigateTarget]);

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: t('register.locationPermissionTitle'),
            message: t('register.locationPermissionMessage'),
            buttonNeutral: t('register.askMeLater'),
            buttonNegative: t('register.cancel'),
            buttonPositive: t('register.ok'),
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

  const updateUserLocation = async (email, location) => {
    const users = await Storage.getItem(StorageKey.LIST_USER);
    const updatedUsers = users.map(user => {
      if (user.email === email.toLowerCase()) {
        return { ...user, ...location };
      }
      return user;
    });
    await Storage.setItem(StorageKey.LIST_USER, updatedUsers);
  };

  const convertImageToBase64 = async (filePath) => {
    try {
      const base64String = await RNFS.readFile(filePath, 'base64');
      return base64String;
    } catch (error) {
      console.error('Error converting image to base64:', error);
      return null;
    }
  };

  const capturePhoto = async () => {
    if (cameraRef.current) {
      const snapshot = await cameraRef.current.takeSnapshot({
        quality: 10,
        scale: 0.5,
        skipMetadata: true,
      });

      const filePath = `file://${snapshot.path}`;
      setPhoto(filePath);
      const base64 = await convertImageToBase64(filePath);
      if (base64) {
        setBase64Photo(base64);
      }
      setCurrRegisterPage(1);
    }
  };

  const handleInputChange = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = () => {
    const { email, firstName, lastName, password, confirmPassword, userRole } = formData;
    if (!email.trim() || !firstName.trim() || !lastName.trim() || !password.trim() || !confirmPassword.trim() || !userRole.trim()) {
      toast.current.ShowToastFunction("error", t('register.allFieldsRequired'));
      return;
    }
    if (password !== confirmPassword) {
      toast.current.ShowToastFunction("error", t('register.passwordMismatch'));
      return;
    }
    if (!photo) {
      toast.current.ShowToastFunction("error", t('register.photoRequired'));
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
    setIsModalVisible(true);
  };

  const handleConfirm = () => {
    setNavigateTarget(CREATE_GROUP_SCREEN);
    fetchRegister({ ...formData, photo: base64Photo, date: moment.now() });
  };

  const handleSkip = () => {
    setNavigateTarget(GROUP_HOME_SCREEN);
    fetchRegister({ ...formData, photo: base64Photo, date: moment.now() });
  };

  const generateInitials = () => {
    const { firstName, lastName } = formData;
    if (!firstName && !lastName) return 'NA';
    return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
  };

  const pageContent = useMemo(() => {
    if (currRegisterPage === 1) {
      return (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : null}>
            <View style={styles.imageContainer}>
              {photo ? (
                <Image source={{ uri: photo }} style={styles.profileImage} />
              ) : (
                <TouchableOpacity onPress={() => setCurrRegisterPage(2)} style={styles.defaultImage}>
                  <Text style={styles.initials}>{generateInitials()}</Text>
                  <Ionicons name="camera-outline" size={20} color={colorScheme.$gray} style={styles.cameraIcon} />
                </TouchableOpacity>
              )}
              <Text style={styles.nameText}>
                {formData.firstName && formData.lastName ? `${formData.firstName} ${formData.lastName}` : t('register.fillName')}
              </Text>
            </View>
            {inputFields.map((field, index) => (
              <View key={index}>
                <View style={styles.inputRow}>
                  <Text style={styles.label}>{field.label}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={field.placeholder}
                    placeholderTextColor={colorScheme.$gray}
                    value={formData[field.key]}
                    onChangeText={(value) => handleInputChange(field.key, value)}
                    secureTextEntry={field.secureTextEntry}
                    textContentType={'none'}
                  />
                  <Ionicons name="chevron-forward" size={20} color={colorScheme.$gray} />
                </View>
                {field.gap && <View style={styles.gap} />}
                {field.separator && <View style={styles.separator} />}
              </View>
            ))}
            <View style={[styles.inputRow, { paddingVertical: 10 }]}>
              <Text style={styles.label}>{t('register.userRole')}</Text>
              <TouchableOpacity
                style={[styles.input]}
                onPress={() => navigation.push(SWAPI_SCREEN, { dataType: 'people' })}
              >
                <Text style={[styles.input, { color: formData.userRole ? 'black' : 'gray' }]}>
                  {formData.userRole || t('register.selectUserRole')}
                </Text>
              </TouchableOpacity>
              <Ionicons name="chevron-forward" size={20} color={colorScheme.$gray} />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      );
    }

    if (isCameraPermitted && currRegisterPage === 2) {
      return (
        <View style={styles.cameraContainer}>
          {device ? (
            <>
              <Camera ref={cameraRef} style={styles.camera} device={device} isActive={true} photo={true} />
              <TouchableOpacity style={styles.takePictureButton} onPress={capturePhoto}>
                <Text style={styles.confirmButtonText}>{t('register.capturePhoto')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.errorText}>{t('register.noCameraAvailable')}</Text>
          )}
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <Text style={styles.errorText}>{t('register.cameraPermissionNotGranted')}</Text>
      </View>
    );
  }, [currRegisterPage, device, isCameraPermitted, formData, photo]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colorScheme.$darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('register.createAccount')}</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>{t('register.save')}</Text>
        </TouchableOpacity>
      </View>
      {pageContent}
      <Modal visible={isModalVisible} transparent animationType="slide" onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t('register.confirmCreateGroup')}</Text>
            <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
              <Text style={styles.confirmButtonText}>{t('register.yes')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
              <Text style={styles.skipButtonText}>{t('register.skip')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default RegisterScreen;