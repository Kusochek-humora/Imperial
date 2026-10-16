// Блокировка прокрутки страницы под модальными окнами (меню, фильтр).
// Ширину скроллбара компенсируем отступом, чтобы контент не прыгал.
let locks = 0;

export function lockScroll() {
  if (locks++ > 0) return;
  const scrollbar = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.paddingRight = scrollbar ? `${scrollbar}px` : '';
  document.body.classList.add('is-locked');
}

export function unlockScroll() {
  if (locks === 0 || --locks > 0) return;
  document.body.style.paddingRight = '';
  document.body.classList.remove('is-locked');
}
