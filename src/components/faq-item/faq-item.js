import './faq-item.scss';

const DURATION = 300;
const EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Плавное раскрытие <details>: анимируем высоту ответа через Web Animations API.
// Атрибут name (эксклюзивный аккордеон) снимаем — иначе браузер закрывает соседей мгновенно,
// вместо этого закрываем их сами с анимацией.
function toggle(item, open) {
  const answer = item.querySelector('.faq-item__answer');
  item.getAnimations({ subtree: true }).forEach((a) => a.cancel());

  if (reducedMotion.matches) {
    item.open = open;
    return;
  }

  item.classList.add('is-animating');

  if (open) {
    item.classList.remove('is-closing');
    item.open = true;
    const height = answer.scrollHeight;
    answer
      .animate(
        [
          { height: '0px', opacity: 0 },
          { height: `${height}px`, opacity: 1 },
        ],
        { duration: DURATION, easing: EASING },
      )
      .finished.then(() => item.classList.remove('is-animating'))
      .catch(() => {});
  } else {
    item.classList.add('is-closing');
    const height = answer.offsetHeight;
    answer
      .animate(
        [
          { height: `${height}px`, opacity: 1 },
          { height: '0px', opacity: 0 },
        ],
        { duration: DURATION, easing: EASING },
      )
      .finished.then(() => {
        item.open = false;
        item.classList.remove('is-animating', 'is-closing');
      })
      .catch(() => {});
  }
}

export function initFaq(root = document) {
  root.querySelectorAll('.faq-list').forEach((list) => {
    const items = [...list.querySelectorAll('.faq-item')];

    items.forEach((item) => {
      item.removeAttribute('name');

      item.querySelector('.faq-item__question').addEventListener('click', (e) => {
        e.preventDefault();
        const opening = !item.open || item.classList.contains('is-closing');

        if (opening) {
          items.forEach((other) => {
            if (other !== item && other.open && !other.classList.contains('is-closing')) toggle(other, false);
          });
        }
        toggle(item, opening);
      });
    });
  });
}
