import i18n from 'i18next';
import translations from './locales';
import { initReactI18next } from 'react-i18next';

const getUiLanguage = () => {
  const browserLang = navigator.language;
  const params = new URLSearchParams(window.location.search);

  const validLangs = ['en', 'pt-BR'];
  const userLang = params.get('lang') ?? localStorage.getItem('language') ?? browserLang;

  const userLanguageIsSupported = validLangs.some(lang => lang === userLang || lang.split('-')[0] === userLang);
  if (!userLanguageIsSupported) {
    return validLangs[0];
  };
  return userLang;
};

i18n.use(initReactI18next).init({
  lng: getUiLanguage(),
  resources: translations,
  fallbackLng: {
    'pt-PT': ['pt-BR'],
    pt: ['pt-BR'],
    default: ['en-US'],
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
