import './lang-switcher.scss';

import { i18next, setLanguage } from '@/i18n';

export function initLangSwitcher() {
  const buttons = document.querySelectorAll('[data-lang]');
  if (!buttons.length) return;

  const updateActive = () => {
    buttons.forEach((btn) => {
      const active = btn.dataset.lang === i18next.language;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  i18next.on('languageChanged', updateActive);
  updateActive();
}
