import './share.scss';

// «Поделиться»: копирует ссылку на страницу и показывает уведомление
let toast;
let timer;

export function showToast(text) {
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML =
      '<span class="toast__text"></span><button class="toast__close" type="button" aria-label="Закрыть"></button>';
    toast.querySelector('.toast__close').addEventListener('click', () => toast.classList.remove('is-visible'));
    document.body.append(toast);
  }

  toast.querySelector('.toast__text').textContent = text;
  requestAnimationFrame(() => toast.classList.add('is-visible'));
  clearTimeout(timer);
  timer = setTimeout(() => toast.classList.remove('is-visible'), 3000);
}

async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // запасной вариант для http и старых браузеров
    const area = Object.assign(document.createElement('textarea'), { value: text });
    area.style.cssText = 'position:fixed;opacity:0';
    document.body.append(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

export function initShare(root = document) {
  root.addEventListener('click', async (e) => {
    const btn = e.target.closest('.js-share');
    if (!btn) return;

    const ok = await copy(btn.dataset.url || location.href);
    showToast(ok ? 'Ссылка скопирована' : 'Не удалось скопировать ссылку');
  });
}
