import './product-card.scss';

// Звёздочка «в избранное»: переключает состояние (пока без сохранения)
export function initFavorites(root = document) {
  root.addEventListener('click', (e) => {
    const btn = e.target.closest('.js-fav');
    if (!btn) return;

    const active = btn.classList.toggle('is-active');
    btn.setAttribute('aria-pressed', String(active));
  });
}
