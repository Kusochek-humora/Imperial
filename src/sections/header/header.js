import './header.scss';

import { lockScroll, unlockScroll } from '@/js/scroll-lock';
import { markActiveLinks } from '@/js/active-links';

// Выпадающие списки (Услуги в меню и в мобильном меню): клик / Esc / клик вне
function initDropdowns(header) {
  const dropdowns = document.querySelectorAll('.js-dropdown');

  const setOpen = (dropdown, open) => {
    dropdown.classList.toggle('is-open', open);
    dropdown.querySelector('.js-dropdown-toggle').setAttribute('aria-expanded', String(open));
  };

  dropdowns.forEach((dropdown) => {
    dropdown.querySelector('.js-dropdown-toggle').addEventListener('click', () => {
      setOpen(dropdown, !dropdown.classList.contains('is-open'));
    });
  });

  document.addEventListener('click', (e) => {
    header.querySelectorAll('.js-dropdown.is-open').forEach((dropdown) => {
      if (!dropdown.contains(e.target)) setOpen(dropdown, false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    header.querySelectorAll('.js-dropdown.is-open').forEach((dropdown) => {
      setOpen(dropdown, false);
      dropdown.querySelector('.js-dropdown-toggle').focus();
    });
  });
}

// Поиск под шапкой
function initSearch(header) {
  const panel = header.querySelector('#search');
  const opener = header.querySelector('.header__actions .js-search-toggle');
  if (!panel || !opener) return;

  const setOpen = (open) => {
    panel.hidden = !open;
    opener.setAttribute('aria-expanded', String(open));
    if (open) panel.querySelector('.js-search-input').focus();
  };

  // на мобильных лупа открывает фильтр hero, если он есть на странице
  const heroFilter = document.querySelector('[data-search-filter]');
  const mobile = window.matchMedia('(max-width: 768px)');

  header.querySelectorAll('.js-search-toggle').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (heroFilter && mobile.matches && btn === opener) {
        heroFilter.dispatchEvent(new Event('filter:open'));
        return;
      }
      setOpen(panel.hidden);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) {
      setOpen(false);
      opener.focus();
    }
  });

  // клик по затемнению под панелью
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !panel.querySelector('.search__inner').contains(e.target) && !opener.contains(e.target)) {
      setOpen(false);
    }
  });
}

// Мобильное меню
function initMobileMenu() {
  const menu = document.getElementById('mobile-menu');
  const opener = document.querySelector('.js-menu-open');
  if (!menu || !opener) return;

  const panel = menu.querySelector('.mobile-menu__panel');

  const open = () => {
    menu.hidden = false;
    lockScroll();
    opener.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => menu.classList.add('is-open'));
    menu.querySelector('.mobile-menu__close').focus();
  };

  const close = () => {
    if (menu.hidden) return;
    menu.classList.remove('is-open');
    opener.setAttribute('aria-expanded', 'false');
    panel.addEventListener(
      'transitionend',
      () => {
        menu.hidden = true;
        unlockScroll();
      },
      { once: true },
    );
    opener.focus();
  };

  opener.addEventListener('click', open);
  menu.querySelectorAll('.js-menu-close').forEach((el) => el.addEventListener('click', close));
  menu.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  // меню нужно только до lg: при расширении экрана закрываем
  window.matchMedia('(min-width: 1025px)').addEventListener('change', (e) => {
    if (e.matches) close();
  });
}

export function initHeader() {
  const header = document.querySelector('.js-header');
  if (!header) return;

  markActiveLinks();
  initDropdowns(header);
  initSearch(header);
  initMobileMenu();
}
