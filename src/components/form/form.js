import './form.scss';

import { showToast } from '@/components/share/share';

// Валидация форм заявок (.js-request-form): имя, телефон с маской, обязательные select и файл.
// Ошибки показываются после первой попытки отправки или ухода из поля, дальше — по мере ввода.

const PHONE_DIGITS = 11; // +7 и 10 цифр
const FILE_TYPES = /\.(pdf|docx?)$/i;
const FILE_MAX = 10 * 1024 * 1024;

// +7 (701) 672-88-10
function formatPhone(value) {
  let digits = value.replace(/\D/g, '');
  if (!digits) return '';
  if (digits[0] === '8') digits = `7${digits.slice(1)}`;
  if (digits[0] !== '7') digits = `7${digits}`;
  digits = digits.slice(0, PHONE_DIGITS);

  const d = digits.slice(1);
  let out = '+7';
  if (d.length) out += ` (${d.slice(0, 3)}`;
  if (d.length >= 3) out += ')';
  if (d.length > 3) out += ` ${d.slice(3, 6)}`;
  if (d.length > 6) out += `-${d.slice(6, 8)}`;
  if (d.length > 8) out += `-${d.slice(8, 10)}`;
  return out;
}

function initPhoneMask(input) {
  input.addEventListener('input', () => {
    // стирание скобки/дефиса не должно «застревать»
    if (input.value.replace(/\D/g, '') === '7' && !input.value.includes('(')) {
      input.value = '';
      return;
    }
    input.value = formatPhone(input.value);
  });

  input.addEventListener('focus', () => {
    if (!input.value) input.value = '+7 (';
  });

  input.addEventListener('blur', () => {
    if (input.value.replace(/\D/g, '').length <= 1) input.value = '';
  });
}

// текст ошибки или '' если поле в порядке
function validate(field) {
  const value = field.value.trim();

  if (field.type === 'file') {
    const file = field.files[0];
    if (!file) return field.required ? 'Прикрепите резюме' : '';
    if (!FILE_TYPES.test(file.name)) return 'Допустимые форматы: .pdf, .doc, .docx';
    if (file.size > FILE_MAX) return 'Файл больше 10 МБ';
    return '';
  }

  if (field.required && !value) {
    if (field.tagName === 'SELECT') return 'Выберите вариант';
    return 'Заполните поле';
  }

  if (field.name === 'name' && value) {
    if (value.length < 2) return 'Слишком короткое имя';
    if (!/^[\p{L}\s'.-]+$/u.test(value)) return 'Имя может содержать только буквы';
  }

  if (field.type === 'tel' && value && value.replace(/\D/g, '').length !== PHONE_DIGITS) {
    return 'Введите номер полностью';
  }

  return '';
}

// куда вставлять ошибку: после обёртки select / внутрь блока загрузки
function errorHost(field) {
  return field.closest('.select') || field.closest('.upload') || field;
}

function showError(field, message) {
  const host = errorHost(field);
  let error = host.nextElementSibling?.classList.contains('field-error') ? host.nextElementSibling : null;
  if (field.closest('.upload')) error = host.querySelector('.field-error');

  field.setAttribute('aria-invalid', String(Boolean(message)));
  host.classList.toggle('is-invalid', Boolean(message));

  if (!message) {
    error?.remove();
    field.removeAttribute('aria-describedby');
    return;
  }

  if (!error) {
    error = document.createElement('p');
    error.className = 'field-error';
    error.id = `${field.id || field.name}-error-${Math.random().toString(36).slice(2, 7)}`;
    if (field.closest('.upload')) host.append(error);
    else host.after(error);
  }
  error.textContent = message;
  field.setAttribute('aria-describedby', error.id);
}

function initForm(form) {
  form.noValidate = true;
  const fields = [...form.querySelectorAll('input:not([type="hidden"]), select, textarea')];
  const submit = form.querySelector('[type="submit"]');
  const touched = new WeakSet();

  form.querySelectorAll('input[type="tel"]').forEach(initPhoneMask);

  const check = (field) => {
    const message = validate(field);
    if (touched.has(field)) showError(field, message);
    return !message;
  };

  fields.forEach((field) => {
    field.addEventListener('blur', () => {
      if (field.value) touched.add(field);
      check(field);
    });
    field.addEventListener('input', () => check(field));
    field.addEventListener('change', () => {
      touched.add(field);
      check(field);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    fields.forEach((f) => touched.add(f));
    const invalid = fields.filter((f) => !check(f));

    if (invalid.length) {
      invalid[0].focus();
      return;
    }

    const label = submit.textContent;
    submit.disabled = true;
    submit.textContent = 'Отправляем…';

    try {
      // пока бэкенда нет (action="#") — имитируем отправку
      const action = form.getAttribute('action');
      if (action && action !== '#') {
        const res = await fetch(action, { method: 'POST', body: new FormData(form) });
        if (!res.ok) throw new Error(res.statusText);
      } else {
        await new Promise((r) => setTimeout(r, 600));
      }

      form.reset();
      // сбросить подпись выбранного файла
      form.querySelectorAll('input[type="file"]').forEach((f) => f.dispatchEvent(new Event('change')));
      fields.forEach((f) => {
        touched.delete(f);
        showError(f, '');
      });
      showToast('Спасибо! Заявка отправлена, мы скоро свяжемся с вами');
    } catch {
      showToast('Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам');
    } finally {
      submit.disabled = false;
      submit.textContent = label;
    }
  });
}

export function initForms(root = document) {
  root.querySelectorAll('.js-request-form').forEach(initForm);
}
