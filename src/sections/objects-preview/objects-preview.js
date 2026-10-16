import './objects-preview.scss';
import '@/components/section-title/section-title.scss';
import '@/components/product-card/product-card.scss';

// Мобильная панель каталога: «Купить / Снять» синхронизируется с фильтром hero,
// кнопка открывает его попап
export function initObjectsToolbar() {
  const filter = document.querySelector('[data-search-filter]');

  document.querySelectorAll('.objects-preview__toolbar').forEach((toolbar) => {
    const tabs = toolbar.querySelectorAll('.js-deal');

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((t) => t.setAttribute('aria-pressed', String(t === tab)));
        const radio = filter?.querySelector(`input[name="deal"][value="${tab.dataset.deal}"]`);
        if (radio) radio.checked = true;
      });
    });

    toolbar.querySelector('.js-filter-trigger')?.addEventListener('click', () => {
      filter?.dispatchEvent(new Event('filter:open'));
    });
  });
}
