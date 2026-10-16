import './filter.scss';

import { lockScroll, unlockScroll } from '@/js/scroll-lock';

const mobile = window.matchMedia('(max-width: 768px)');

// «23783838» → «23 783 838»
function initNumberInputs(form) {
  form.querySelectorAll('.js-number').forEach((input) => {
    input.addEventListener('input', () => {
      const digits = input.value.replace(/\D/g, '');
      input.value = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    });
  });

  // в запрос уходят числа без пробелов
  form.addEventListener('formdata', (e) => {
    form.querySelectorAll('.js-number').forEach((input) => {
      if (input.value) e.formData.set(input.name, input.value.replace(/\D/g, ''));
      else e.formData.delete(input.name);
    });
  });
}

// Мобильный попап с полями
function initPopup(form) {
  const opener = form.querySelector('.js-filter-open');
  if (!opener) return;

  const setOpen = (open) => {
    if (form.classList.contains('is-open') === open) return;
    form.classList.toggle('is-open', open);
    opener.setAttribute('aria-expanded', String(open));
    if (open) lockScroll();
    else unlockScroll();
  };

  opener.addEventListener('click', () => setOpen(true));
  // открытие снаружи (лупа в шапке на мобильных): form.dispatchEvent(new Event('filter:open'))
  form.addEventListener('filter:open', () => setOpen(true));
  form.querySelector('.js-filter-close').addEventListener('click', () => {
    setOpen(false);
    opener.focus();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });

  mobile.addEventListener('change', (e) => {
    if (!e.matches) setOpen(false);
  });
}

// Список / Карта. Состояние уходит событием 'filter:view' (detail: 'list' | 'map'),
// его слушает страница каталога, чтобы показать карту или сетку
function initView(form) {
  const buttons = form.querySelectorAll('.js-view');
  const toggle = form.querySelector('.js-view-toggle');

  const setView = (view) => {
    buttons.forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.view === view)));
    toggle?.setAttribute('aria-pressed', String(view === 'map'));
    form.dispatchEvent(new CustomEvent('filter:view', { detail: view, bubbles: true }));
  };

  buttons.forEach((btn) => btn.addEventListener('click', () => setView(btn.dataset.view)));
  toggle?.addEventListener('click', () => setView(toggle.getAttribute('aria-pressed') === 'true' ? 'list' : 'map'));
}

export function initFilters() {
  document.querySelectorAll('.js-filter').forEach((form) => {
    initNumberInputs(form);
    initPopup(form);
    initView(form);
  });
}
