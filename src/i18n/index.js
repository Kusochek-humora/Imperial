import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import ru from './locales/ru.json';
import kz from './locales/kz.json';

export const SUPPORTED_LANGS = ['ru', 'kz'];

// Проставляет переводы во все элементы с data-i18n / data-i18n-<attr>
// <p data-i18n="home.title"></p>
// <input data-i18n-placeholder="form.email">
export function translatePage(root = document) {
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    el.innerHTML = i18next.t(el.dataset.i18n);
  });

  ['placeholder', 'title', 'alt', 'aria-label'].forEach((attr) => {
    root.querySelectorAll(`[data-i18n-${attr}]`).forEach((el) => {
      el.setAttribute(attr, i18next.t(el.getAttribute(`data-i18n-${attr}`)));
    });
  });

  // в lang нужен код языка (BCP 47): казахский — kk, kz — код страны
  document.documentElement.lang = i18next.language === 'kz' ? 'kk' : i18next.language;
}

export async function initI18n() {
  await i18next.use(LanguageDetector).init({
    resources: {
      ru: { translation: ru },
      kz: { translation: kz },
    },
    supportedLngs: SUPPORTED_LANGS,
    fallbackLng: 'ru',
    load: 'languageOnly',
    detection: {
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lang',
      caches: ['localStorage'],
      convertDetectedLanguage: (lng) => (lng.startsWith('kk') ? 'kz' : lng),
    },
    interpolation: { escapeValue: false },
  });

  i18next.on('languageChanged', () => translatePage());
  translatePage();
}

export const setLanguage = (lng) => i18next.changeLanguage(lng);
export const t = i18next.t.bind(i18next);
export { i18next };
