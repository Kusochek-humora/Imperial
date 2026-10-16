// Подсвечивает пункты меню текущей страницы (aria-current="page").
// <body data-nav="catalog.html"> — какой пункт подсветить, если страница не в меню (объект, статья)
export function markActiveLinks(root = document) {
  const file = location.pathname.split('/').pop() || 'index.html';
  const current = [file, document.body.dataset.nav].filter(Boolean);

  root.querySelectorAll('.js-header a[href], .mobile-menu a[href]').forEach((link) => {
    const target = link.getAttribute('href').split(/[?#]/)[0].split('/').pop();
    if (current.includes(target)) link.setAttribute('aria-current', 'page');
  });

  // «Услуги»: подсвечиваем, если открыта одна из страниц выпадающего списка
  root.querySelectorAll('.js-dropdown').forEach((dropdown) => {
    if (dropdown.querySelector('[aria-current="page"]')) {
      dropdown.querySelector('.js-dropdown-toggle').classList.add('is-current');
    }
  });
}
