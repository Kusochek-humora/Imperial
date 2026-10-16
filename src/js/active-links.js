// Подсвечивает пункты меню текущей страницы (aria-current="page")
export function markActiveLinks(root = document) {
  const current = location.pathname.split('/').pop() || 'index.html';

  root.querySelectorAll('nav a[href]').forEach((link) => {
    const file = link.getAttribute('href').split(/[?#]/)[0].split('/').pop();
    if (file === current) link.setAttribute('aria-current', 'page');
  });
}
