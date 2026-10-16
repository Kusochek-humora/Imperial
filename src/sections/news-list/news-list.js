import './news-list.scss';

// «Загрузить ещё»: пока без API — дублируем последние 4 карточки
export function initNewsList() {
  const grid = document.querySelector('.js-news-grid');
  const more = document.querySelector('.js-news-more');
  if (!grid || !more) return;

  let loads = 0;
  more.addEventListener('click', () => {
    [...grid.children].slice(-4).forEach((card) => grid.append(card.cloneNode(true)));
    if (++loads >= 2) more.hidden = true;
  });
}
