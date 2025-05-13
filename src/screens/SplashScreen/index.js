import React, { useEffect } from 'react';
import { View, Image, StyleSheet, StatusBar } from 'react-native';
import StarWarsSplash from '../../../assets/images/star-wars-splash.png'
import Storage from '../../utils/Storages';
import { StorageKey } from '../../utils/GlobalConfig';
import { BOTTOM_TAB_BAR, LOGIN_SCREEN } from '../../constants/RootKey';

const SplashScreen = ({ navigation }) => {

  useEffect(() => {
    const checkIsLoggedIn = async () => {
      const userLoginData = await Storage.getItem(StorageKey.CURR_USER_LOGIN_DATA)
      if (userLoginData) {
        return navigation.replace(BOTTOM_TAB_BAR)
      }
      return navigation.replace(LOGIN_SCREEN)
    }
    checkIsLoggedIn()
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image
        source={StarWarsSplash}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: 150,
    height: 150,
  },
});

export default SplashScreen;
