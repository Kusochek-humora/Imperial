import './header.scss';

import { lockScroll, unlockScroll } from '@/js/scroll-lock';
import { markActiveLinks } from '@/js/active-links';

// Демо-данные подсказок, пока нет API поиска
const QUERIES = ['Бизнес центр', 'Офисы', 'Офис класса А', 'Помещение', 'Помещение свободного назначения', 'Торговое помещение', 'Склад', 'Земельный участок', 'Аренда офиса', 'Купить офис'];
const OBJECTS = [
  'Офис в бизнес-центре Almaty Plaza',
  'Офис в бизнес-центре Imperial Plaza',
  'Помещение свободного назначения в Park Commercial',
  'Торговое помещение в River Park Plaza',
];

const escapeHtml = (text) => text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// выделяем совпадение с запросом
function highlight(text, query) {
  const i = text.toLowerCase().indexOf(query.toLowerCase());
  if (i < 0) return escapeHtml(text);
  return `${escapeHtml(text.slice(0, i))}<mark>${escapeHtml(text.slice(i, i + query.length))}</mark>${escapeHtml(text.slice(i + query.length))}`;
}

// Подсказки по введённым буквам: запросы + подходящие объекты
function initSuggestions(panel) {
  const input = panel.querySelector('.js-search-input');
  const queries = panel.querySelector('.js-search-queries');
  const objects = panel.querySelector('.js-search-objects');
  const empty = panel.querySelector('.js-search-empty');
  const initial = { queries: queries.innerHTML, objects: objects.innerHTML };
  // иконки берём из уже отрисованной разметки (inline-svg собираются при сборке)
  const arrowIcon = panel.querySelector('.js-search-objects .icon').outerHTML;
  const searchIcon = panel.querySelector('.search__field-icon').outerHTML.replace('search__field-icon', '');

  input.addEventListener('input', () => {
    const q = input.value.trim();

    if (!q) {
      queries.innerHTML = initial.queries;
      objects.innerHTML = initial.objects;
      queries.setAttribute('aria-label', 'Недавние запросы');
      queries.hidden = objects.hidden = false;
      empty.hidden = true;
      return;
    }

    const has = (text) => text.toLowerCase().includes(q.toLowerCase());
    const foundQueries = QUERIES.filter(has).slice(0, 5);
    const foundObjects = OBJECTS.filter(has).slice(0, 5);

    queries.setAttribute('aria-label', 'Подсказки');
    queries.innerHTML = foundQueries
      .map((t) => `<li><a class="search__link" href="./catalog.html?q=${encodeURIComponent(t)}">${searchIcon}<span>${highlight(t, q)}</span></a></li>`)
      .join('');
    objects.innerHTML = foundObjects
      .map((t) => `<li><a class="search__link" href="./product.html">${arrowIcon}<span>${highlight(t, q)}</span></a></li>`)
      .join('');

    queries.hidden = !foundQueries.length;
    objects.hidden = !foundObjects.length;
    empty.hidden = Boolean(foundQueries.length || foundObjects.length);
  });

}

// Поиск под шапкой
function initSearch(header) {
  const panel = header.querySelector('#search');
  const opener = header.querySelector('.header__actions .js-search-toggle');
  if (!panel || !opener) return;

  initSuggestions(panel);

  const setOpen = (open) => {
    if (panel.hidden === !open) return;
    panel.hidden = !open;
    opener.setAttribute('aria-expanded', String(open));
    if (open) {
      lockScroll();
      panel.querySelector('.js-search-input').focus();
    } else {
      unlockScroll();
    }
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
  initSearch(header);
  initMobileMenu();
}
