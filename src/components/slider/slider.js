import './slider.scss';

// Стрелки слайдера: прокрутка на ширину одной карточки, блокировка на краях
export function initSliders(root = document) {
  root.querySelectorAll('.js-slider').forEach((slider) => {
    const track = slider.querySelector('.js-slider-track');
    const prev = slider.querySelector('.js-slider-prev');
    const next = slider.querySelector('.js-slider-next');
    const dots = slider.querySelector('.js-slider-dots');
    if (!track) return;

    // точки: по одной на слайд, активная — текущий слайд
    if (dots) {
      [...track.children].forEach((slide, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'slider__dot';
        dot.setAttribute('aria-label', `Слайд ${i + 1}`);
        dot.addEventListener('click', () => track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: 'smooth' }));
        dots.append(dot);
      });

      const updateDots = () => {
        const index = Math.round(track.scrollLeft / track.clientWidth);
        [...dots.children].forEach((dot, i) => dot.classList.toggle('is-active', i === index));
      };
      track.addEventListener('scroll', updateDots, { passive: true });
      updateDots();
    }

    if (!prev || !next) return;

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
