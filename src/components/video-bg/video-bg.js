import './video-bg.scss';

// Фоновое видео подгружается после загрузки страницы, чтобы не тормозить первый экран.
// Не грузим при «уменьшении движения» и в режиме экономии трафика.
export function initVideoBg(root = document) {
  const blocks = root.querySelectorAll('.video-bg[data-youtube]');
  if (!blocks.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (navigator.connection?.saveData) return;

  const load = () => {
    blocks.forEach((block) => {
      const id = block.dataset.youtube;
      const params = new URLSearchParams({
        autoplay: 1,
        mute: 1,
        loop: 1,
        playlist: id, // нужно для зацикливания
        controls: 0,
        playsinline: 1,
        rel: 0,
        disablekb: 1,
        iv_load_policy: 3,
        modestbranding: 1,
      });
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?${params}`;
      iframe.title = 'Фоновое видео';
      iframe.tabIndex = -1;
      iframe.allow = 'autoplay; encrypted-media';
      // плеер YouTube появляется с чёрным экраном — показываем после небольшой паузы
      iframe.addEventListener('load', () => setTimeout(() => block.classList.add('is-ready'), 1200));
      block.append(iframe);
    });
  };

  if (document.readyState === 'complete') load();
  else window.addEventListener('load', load, { once: true });
}
