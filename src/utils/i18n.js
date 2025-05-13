import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';
import en from '../constants/en.json';
import id from '../constants/id.json';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (callback) => {
    const locale =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0]
        : NativeModules.I18nManager.localeIdentifier;
    const language = locale ? locale.split('_')[0] : 'en';
    callback(language);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      id: { translation: id },
    },
    lng: 'en',
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;