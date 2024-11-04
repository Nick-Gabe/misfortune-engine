import i18n from 'i18next';
import translations from './locales';
import { initReactI18next } from 'react-i18next';

const getUiLanguage = () => {
  const browserLang = navigator.language;
  const params = new URLSearchParams(window.location.search);

  return params.get('lang') ?? browserLang;
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
