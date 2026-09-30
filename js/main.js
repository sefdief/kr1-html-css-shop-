// Модальное окно (только если есть на странице)
const dialog = document.getElementById('order-dialog');
const productInput = document.getElementById('dlg-product');

if (dialog) {
  document.querySelectorAll('[data-product]').forEach((button) => {
    button.addEventListener('click', () => {
      productInput.value = button.dataset.product;
      dialog.showModal();
    });
  });
  dialog.querySelectorAll('[data-close-dialog]').forEach((button) => {
    button.addEventListener('click', () => dialog.close());
  });
}

// Проверка форм: подсвечиваем невалидные поля через aria-invalid
document.querySelectorAll('.order-form').forEach((form) => {
  form.addEventListener('submit', (event) => {
    event.preventDefault(); // backend пока не подключён
    const fields = Array.from(form.elements).filter((el) => el.willValidate);
    fields.forEach((el) => el.removeAttribute('aria-invalid'));

    if (!form.checkValidity()) {
      fields.forEach((el) => {
        if (!el.checkValidity()) el.setAttribute('aria-invalid', 'true');
      });
      form.reportValidity();
      return;
    }

    const message = document.querySelector('[data-success]');
    if (message) message.hidden = false;
    form.reset();
    if (dialog && dialog.open) dialog.close();
  });
});
