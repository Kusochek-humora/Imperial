import './catalog.scss';

// Список / Карта из фильтра показывает или прячет карту над выдачей
// На мобильных в режиме карты баннеры «Купить / Снять» скрываются — карта встаёт первой.
// По умолчанию карта открыта; на мобильном каталоге с баннерами — список
function initView() {
  const map = document.querySelector('[data-catalog-map]');
  if (!map) return;

  document.addEventListener('filter:view', (e) => {
    const isMap = e.detail === 'map';
    map.hidden = !isMap;
    document.body.classList.toggle('is-map-view', isMap);
  });

  const mobile = window.matchMedia('(max-width: 768px)').matches;
  const initial = mobile && document.querySelector('.catalog-links') ? 'list' : 'map';
  document.querySelector(`.js-view[data-view="${initial}"]`)?.click();
}

// Избранное: снятие звёздочки убирает карточку, «Очистить» — все сразу
function initFavoritesPage() {
  const catalog = document.querySelector('.catalog--favorites');
  if (!catalog) return;

  const grid = catalog.querySelector('.js-catalog-grid');
  const empty = catalog.querySelector('.catalog__empty');

  const update = () => {
    empty.hidden = grid.children.length > 0;
  };

  // на странице избранного все карточки отмечены
  grid.querySelectorAll('.js-fav').forEach((btn) => {
    btn.classList.add('is-active');
    btn.setAttribute('aria-pressed', 'true');
  });

  grid.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-fav');
    if (!btn || btn.classList.contains('is-active')) return;
    btn.closest('.product-card').remove();
    update();
  });

  // очистка — после подтверждения в попапе
  catalog.querySelector('.js-favorites-clear').addEventListener('modal:confirm', () => {
    grid.replaceChildren();
    update();
  });
}

export function initCatalog() {
  initView();
  initFavoritesPage();
}
