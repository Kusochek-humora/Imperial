// Плавное появление блоков при прокрутке. Классы навешиваются из JS по списку селекторов,
// поэтому разметку трогать не нужно; без JS всё видно сразу.
// Элементы одной сетки появляются по очереди (задержка по индексу в ряду).

const SINGLE = [
  '.section-head',
  '.section > .section-title',
  '.owners__box',
  '.check-table',
  '.glass-band',
  '.video',
  '.slider',
  '.text-columns > *',
  '.split > *',
  '.brand > *',
  '.history > *',
  '.career > *',
  '.contacts > *',
  '.news-wide > *',
  '.prose',
  '.page-banner',
  '.catalog__map',
  '.partners__marquee',
];

// дети этих контейнеров появляются «лесенкой»
const STAGGER = ['.cards-grid', '.tiles', '.steps', '.link-cards', '.faq-list', '.about__grid', '.about__cards', '.owners__cards', '.reward__cards'];

const STEP = 80; // мс между соседями
const MAX_IN_ROW = 4;

export function initReveal(root = document) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;

  const items = new Set(root.querySelectorAll(SINGLE.join(',')));

  root.querySelectorAll(STAGGER.join(',')).forEach((parent) => {
    [...parent.children].forEach((child, i) => {
      child.style.setProperty('--reveal-delay', `${(i % MAX_IN_ROW) * STEP}ms`);
      items.add(child);
    });
  });

  // в hero и шапке ничего не анимируем — они видны сразу
  const targets = [...items].filter((el) => !el.closest('.hero, .page-hero, .header, .slider__track'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
        // после анимации убираем transition, чтобы не мешать hover-эффектам
        const done = (e) => {
          if (e.target !== entry.target) return; // события дочерних элементов всплывают
          entry.target.classList.add('is-reveal-done');
          entry.target.removeEventListener('transitionend', done);
        };
        entry.target.addEventListener('transitionend', done);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );

  targets.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });
}
