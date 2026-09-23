// Получаем модальное окно.
const orderDialog = document.getElementById('order-dialog');

// Получаем форму заявки.
const orderForm = document.getElementById('order-form');

// Получаем сообщение об успешной отправке.
const successMessage = document.getElementById('success-message');

// Получаем скрытое поле с выбранным товаром.
const selectedProduct = document.getElementById('selected-product');

// Получаем все кнопки "Заказать".
const orderButtons = document.querySelectorAll('.product-card__button');

// Открываем форму при нажатии на "Заказать".
orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    selectedProduct.value = button.dataset.product;
    orderDialog.showModal();
  });
});

// Получаем кнопку "Закрыть".
const closeOrderDialog = document.getElementById('close-order-dialog');

// Закрываем модальное окно.
closeOrderDialog.addEventListener('click', () => {
  orderDialog.close();
});

// Обрабатываем отправку формы.
orderForm.addEventListener('submit', (event) => {
  // Отменяем стандартную отправку формы,
  // потому что backend пока не подключён.
  event.preventDefault();

  // Сбрасываем предыдущие признаки ошибок.
  const formElements = Array.from(orderForm.elements);

  formElements.forEach((element) => {
    if (element.willValidate) {
      element.removeAttribute('aria-invalid');
    }
  });

  // Проверяем встроенные HTML-ограничения формы.
  if (!orderForm.checkValidity()) {
    formElements.forEach((element) => {
      if (element.willValidate && !element.checkValidity()) {
        element.setAttribute('aria-invalid', 'true');
      }
    });

    // Показываем стандартные сообщения браузера.
    orderForm.reportValidity();
    return;
  }

  // Показываем сообщение об успешной отправке.
  successMessage.hidden = false;

  // Очищаем форму.
  orderForm.reset();

  // Закрываем модальное окно.
  orderDialog.close();
});