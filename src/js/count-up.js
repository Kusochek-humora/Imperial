// Анимация «бегущих» чисел: <b data-count-up>2 000 000+</b>
// Число берётся из текста, всё нечисловое после него (+, м² и т.п.) сохраняется.
// Стартует, когда элемент появляется на экране.
const DURATION = 1800;

const format = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const easeOut = (t) => 1 - (1 - t) ** 3;

function run(el) {
  const match = el.textContent.trim().match(/^([\d\s]+)(.*)$/);
  if (!match) return;

  const target = parseInt(match[1].replace(/\s/g, ''), 10);
  // фиксируем ширину по итоговому числу, чтобы плитки не прыгали во время счёта
  el.style.display = 'inline-block';
  el.style.minWidth = `${el.getBoundingClientRect().width}px`;
  const suffix = match[2];
  const start = performance.now();

  const frame = (now) => {
    const t = Math.min((now - start) / DURATION, 1);
    el.textContent = format(Math.round(target * easeOut(t))) + suffix;
    if (t < 1) requestAnimationFrame(frame);
  };

  requestAnimationFrame(frame);
}

export function initCountUp(root = document) {
  const items = root.querySelectorAll('[data-count-up]');
  if (!items.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        run(entry.target);
      });
    },
    { threshold: 0.6 },
  );

  items.forEach((el) => observer.observe(el));
}
