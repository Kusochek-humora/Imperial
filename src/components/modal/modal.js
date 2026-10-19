import './modal.scss';

import { lockScroll, unlockScroll } from '@/js/scroll-lock';

// Попапы: <button data-modal-open="request"> открывает <dialog id="modal-request">.
// Закрытие — крестик/«Отмена» (.js-modal-close), Esc, клик по затемнению, успешная отправка формы.
// Подтверждение (.js-modal-confirm) отправляет событие 'modal:confirm' на открывшую кнопку.
export function openModal(id, trigger) {
  const modal = document.getElementById(`modal-${id}`);
  if (!modal || modal.open) return;
  modal.trigger = trigger;
  modal.showModal();
  lockScroll();
}

export function initModals(root = document) {
  root.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-modal-open]');
    if (!trigger) return;
    e.preventDefault();
    // из мобильного меню: сначала закрываем меню
    trigger.closest('.mobile-menu')?.querySelector('.js-menu-close')?.click();
    openModal(trigger.dataset.modalOpen, trigger);
  });

  root.querySelectorAll('dialog.modal').forEach((modal) => {
    const close = () => modal.close();

    modal.addEventListener('close', () => {
      unlockScroll();
      modal.trigger?.focus();
    });

    modal.querySelectorAll('.js-modal-close').forEach((btn) => btn.addEventListener('click', close));

    // клик по затемнению (сам <dialog>, а не его содержимое)
    modal.addEventListener('click', (e) => {
      if (e.target === modal) close();
    });

    modal.querySelector('.js-modal-confirm')?.addEventListener('click', () => {
      modal.trigger?.dispatchEvent(new CustomEvent('modal:confirm', { bubbles: true }));
      close();
    });

    modal.addEventListener('request:sent', close);
  });
}
