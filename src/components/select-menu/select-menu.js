import './select-menu.scss';

// Выпадающие списки с радиокнопками: открытие по клику, выбор закрывает список,
// клик вне и Esc — тоже. Выбранное значение уходит событием 'select:change'
export function initSelectMenus(root = document) {
  const menus = [...root.querySelectorAll('.js-select')];
  if (!menus.length) return;

  const setOpen = (menu, open) => {
    menu.classList.toggle('is-open', open);
    menu.querySelector('.js-select-toggle').setAttribute('aria-expanded', String(open));
  };

  menus.forEach((menu) => {
    const value = menu.querySelector('.js-select-value');

    menu.querySelector('.js-select-toggle').addEventListener('click', () => {
      setOpen(menu, !menu.classList.contains('is-open'));
    });

    menu.addEventListener('change', (e) => {
      if (e.target.type !== 'radio') return;
      // у периода подпись не меняем — показывает даты
      if (!menu.hasAttribute('data-keep-label')) value.textContent = e.target.nextElementSibling.textContent;
      setOpen(menu, false);
      menu.dispatchEvent(new CustomEvent('select:change', { detail: e.target.value, bubbles: true }));
    });
  });

  document.addEventListener('click', (e) => {
    menus.forEach((menu) => {
      if (!menu.contains(e.target)) setOpen(menu, false);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') menus.forEach((menu) => setOpen(menu, false));
  });
}
