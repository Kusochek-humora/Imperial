import './slider.scss';

// Стрелки слайдера: прокрутка на ширину одной карточки, блокировка на краях
export function initSliders(root = document) {
  root.querySelectorAll('.js-slider').forEach((slider) => {
    const track = slider.querySelector('.js-slider-track');
    const prev = slider.querySelector('.js-slider-prev');
    const next = slider.querySelector('.js-slider-next');
    if (!track || !prev || !next) return;

    const step = () => {
      const slide = track.firstElementChild;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return slide ? slide.getBoundingClientRect().width + gap : track.clientWidth;
    };

    const update = () => {
      const max = track.scrollWidth - track.clientWidth - 1;
      prev.disabled = track.scrollLeft <= 0;
      next.disabled = track.scrollLeft >= max;
      // все карточки помещаются — стрелки не нужны
      slider.classList.toggle('is-static', max <= 0);
    };

    prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });
}
