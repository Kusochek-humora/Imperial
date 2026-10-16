import './content.scss';

// Вкладки: <div class="js-tabs"> кнопки [role=tab][aria-controls] + панели [role=tabpanel]
function initTabs(root) {
  root.querySelectorAll('.js-tabs').forEach((tabs) => {
    const buttons = [...tabs.querySelectorAll('[role="tab"]')];

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        buttons.forEach((b) => {
          const active = b === btn;
          b.setAttribute('aria-selected', String(active));
          b.tabIndex = active ? 0 : -1;
          document.getElementById(b.getAttribute('aria-controls')).hidden = !active;
        });
      });
    });
  });
}

// «Читать полностью»: раскрываем на всю высоту текста
function initReadMore(root) {
  root.querySelectorAll('.js-read-more').forEach((block) => {
    const body = block.querySelector('.read-more__body');
    const toggle = block.querySelector('.read-more__toggle');
    const label = toggle.querySelector('span');
    const collapsed = getComputedStyle(body).maxHeight;

    // текст короткий — кнопка не нужна
    if (body.scrollHeight <= body.clientHeight + 4) {
      toggle.hidden = true;
      block.classList.add('is-open');
      return;
    }

    toggle.addEventListener('click', () => {
      const open = block.classList.toggle('is-open');
      body.style.maxHeight = open ? `${body.scrollHeight}px` : collapsed;
      label.textContent = open ? 'Свернуть' : 'Читать полностью';
      toggle.setAttribute('aria-expanded', String(open));
    });
  });
}

// Загрузка резюме: показываем имя выбранного файла
function initUploads(root) {
  root.querySelectorAll('.js-upload').forEach((upload) => {
    const input = upload.querySelector('input[type="file"]');
    const hint = upload.querySelector('.upload__hint');
    const initial = hint.textContent;

    input.addEventListener('change', () => {
      const file = input.files[0];
      hint.textContent = file ? file.name : initial;
      upload.classList.toggle('is-filled', Boolean(file));
    });
  });
}

export function initContent(root = document) {
  initTabs(root);
  initReadMore(root);
  initUploads(root);
}
